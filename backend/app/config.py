from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Mathstral AI Assistant"
    PROJECT_VERSION: str = "1.0.0"
    ALLOWED_ORIGINS: list = ["http://localhost:3000"]
    DOCKER_IMAGE_PREFIX: str = "mathstral"

    class Config:
        env_file = ".env"


settings = Settings()
