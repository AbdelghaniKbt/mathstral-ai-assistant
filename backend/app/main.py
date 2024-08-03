from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
import logging

# Set up logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.debug(f"Received {request.method} request to {request.url}")
    response = await call_next(request)
    return response


app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Mathstral AI Assistant is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
