import json
import logging

from app.api.models import (GenerateRequest, InitializeRequest, Response,
                            StreamResponse)
from app.services.model_service import model_service
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/generate")
async def generate(request: GenerateRequest):
    async def event_generator():
        try:
            logger.info(f"Starting generation with input: {request.text[:50]}...")
            async for token in model_service.generate(
                request.text,
                request.max_new_tokens,
                request.temperature,
                request.top_p,
                request.top_k,
            ):
                yield f"data: {json.dumps(StreamResponse(token=token, finished=False).dict())}\n\n"
            logger.info("Generation completed")
            yield f"data: {json.dumps(StreamResponse(token='', finished=True).dict())}\n\n"
        except Exception as e:
            logger.exception(f"Error during generation: {str(e)}")
            error_message = f"An error occurred: {str(e)}"
            yield f"data: {json.dumps(StreamResponse(token='', finished=True, error=error_message).dict())}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/initialize", response_model=Response)
async def initialize(request: InitializeRequest):
    try:
        logger.info(
            f"Initializing model with serving framework: {request.serving_framework}"
        )
        await model_service.initialize(request.hf_token)
        logger.info("Model initialized successfully")
        return Response(message="Model initialized successfully")
    except Exception as e:
        logger.exception(f"Error during model initialization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
