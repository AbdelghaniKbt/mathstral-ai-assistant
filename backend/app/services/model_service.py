import asyncio
import json
import logging
import os
import time

import aiohttp
import docker
from huggingface_hub import hf_hub_download

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelService:
    def __init__(self):
        self.llama_url = os.getenv("LLAMA_URL", "http://llama:8080")
        self.model_path = "/models/mathstral-7b-v0.1-q8_0.gguf"
        self.model_downloaded = False
        self.docker_client = docker.from_env()

    async def initialize(self, hf_token: str):
        logger.info("Starting initialization process")
        if not self.model_downloaded:
            logger.info("Model not downloaded. Starting download process.")
            repo_id = "reach-vb/mathstral-7B-v0.1-Q8_0-GGUF"
            filename = "mathstral-7b-v0.1-q8_0.gguf"

            try:
                await asyncio.to_thread(
                    hf_hub_download,
                    repo_id=repo_id,
                    filename=filename,
                    token=hf_token,
                    local_dir="/models",
                    local_dir_use_symlinks=False,
                )
                logger.info("Model downloaded successfully")
                self.model_downloaded = True
            except Exception as e:
                logger.error(f"Error downloading model: {str(e)}")
                raise

        logger.info("Restarting llama service")
        try:
            llama_container = self.docker_client.containers.get("mathstral-llama-1")
            llama_container.restart()
            logger.info("Llama service restarted")
        except docker.errors.NotFound:
            logger.error("Llama service container not found")
            raise
        except Exception as e:
            logger.error(f"Error restarting llama service: {str(e)}")
            raise

        logger.info("Waiting for llama service to become available")
        try:
            await self._wait_for_llama_service()
            logger.info("Initialization complete")
        except Exception as e:
            logger.error(f"Llama service failed to start: {str(e)}")
            # Check if the container exited
            llama_container = self.docker_client.containers.get("mathstral-llama-1")
            if llama_container.status == "exited":
                logs = llama_container.logs().decode("utf-8")
                logger.error(f"Llama service container exited. Logs: {logs}")
                raise Exception(
                    f"Llama service failed to start. It may have run out of memory. Logs: {logs}"
                )
            else:
                raise

    async def _wait_for_llama_service(self, timeout=60, interval=1):
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{self.llama_url}/health") as response:
                        if response.status == 200:
                            logger.info("Llama service is available")
                            return
            except aiohttp.ClientError:
                pass
            await asyncio.sleep(interval)
        raise Exception("Llama service did not become available in time")

    async def generate(
        self, prompt: str, max_tokens: int, temperature: float, top_p: float, top_k: int
    ):
        if not self.model_downloaded:
            raise Exception("Model not initialized. Please call initialize first.")

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    f"{self.llama_url}/completion",
                    json={
                        "prompt": prompt,
                        "n_predict": max_tokens,
                        "temperature": temperature,
                        "top_p": top_p,
                        "top_k": top_k,
                        "stream": True,
                    },
                    timeout=aiohttp.ClientTimeout(total=None),  # No timeout
                ) as response:
                    async for line in response.content:
                        if line:
                            try:
                                line = line.decode("utf-8").strip()
                                if line.startswith("data: "):
                                    data = json.loads(
                                        line[6:]
                                    )  # Remove 'data: ' prefix
                                    if "content" in data:
                                        yield data["content"]
                                    elif "stop" in data and data["stop"]:
                                        break
                            except json.JSONDecodeError:
                                logger.error(f"Failed to decode JSON: {line}")
            except Exception as e:
                logger.error(f"An error occurred during generation: {str(e)}")
                yield f"An error occurred: {str(e)}"


model_service = ModelService()
