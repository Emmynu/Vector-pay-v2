from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    
    DATABASE_URL:str
    MAIL_TOKEN: dict
    RABBITMQ_URL: str
    JWT_SECRET_TOKEN:str
    JWT_ALGORITHMS: str
    BASE_URL:str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


config  = Settings()