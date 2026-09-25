from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    database_url: str = "sqlite:///./skillbridge.db"
    secret_key: str = "development-only-change-me"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    max_upload_mb: int = 10
    # Local development commonly uses either hostname. Keep this explicit rather
    # than allowing arbitrary browser origins.
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
settings = Settings()
