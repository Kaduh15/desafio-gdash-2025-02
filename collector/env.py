from dotenv import load_dotenv
import os

load_dotenv()

REQUIRED_VARS = [
    "BROKER_HOST",
    "BROKER_QUEUE",
    "BROKER_USER",
    "BROKER_PASSWORD",
    "API_KEY_OPENWEATHER",
    "CITY"
]

def _load_env_var(var_name: str) -> str:
    value = os.getenv(var_name)
    if not value:
        raise ValueError(f"{var_name} environment variable is not set.")
    return value

BROKER_HOST: str = _load_env_var("BROKER_HOST")
BROKER_QUEUE: str = _load_env_var("BROKER_QUEUE")
BROKER_USER: str = _load_env_var("BROKER_USER")
BROKER_PASSWORD: str = _load_env_var("BROKER_PASSWORD")
API_KEY_OPENWEATHER: str = _load_env_var("API_KEY_OPENWEATHER")
CITY: str = _load_env_var("CITY")
SCHEDULER_INTERVAL_MINUTES: int = int(os.getenv("SCHEDULER_INTERVAL_MINUTES", 15))

__all__ = REQUIRED_VARS
