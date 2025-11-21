import os
import json
import pika
import time
from typing import Dict, Any

from dotenv import load_dotenv
from httpxfetch import fetch
from schedule import every, repeat, run_pending

load_dotenv()

BROKER_HOST = os.getenv("BROKER_HOST", "localhost")
LAT = os.getenv("LAT")
LON = os.getenv("LON")
CITY = os.getenv("CITY")
INTERVAL_TIME = os.getenv("INTERVAL_TIME", "hours")
INTERVAL_VALUE = int(os.getenv("INTERVAL_VALUE", 1))
QUEUE_NAME = os.getenv("BROKER_QUEUE", "weather_data")

if not LAT or not LON:
    raise ValueError(
        "Latitude (LAT) and Longitude (LON) must be set in environment variables."
    )


URL_API_WEATHER = (
    f"https://api.open-meteo.com/v1/forecast"
    f"?latitude={LAT}"
    f"&longitude={LON}"
    f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,pressure_msl"
    f"&hourly=precipitation_probability"
    f"&timezone=America%2FSao_Paulo"
)


def collect_weather_data() -> Dict[str, Any]:
    response = fetch(URL_API_WEATHER)
    print(f"Fetching weather data from: {URL_API_WEATHER}")

    if response.status_code != 200:
        raise Exception(f"Error fetching weather data: {response.status_code}")

    data = response.json()

    return {
        "time": data["current"]["time"],
        "temperature": data["current"]["temperature_2m"],
        "humidity": data["current"]["relative_humidity_2m"],
        "wind_speed": data["current"]["wind_speed_10m"],
        "weather_code": data["current"]["weather_code"],
        "pressure": data["current"]["pressure_msl"],
        "precipitation_probability": data["hourly"]["precipitation_probability"][0],
        "elevation": data["elevation"],
        "latitude": data["latitude"],
        "longitude": data["longitude"],
        "city": CITY,
    }


def publish_to_queue(data: Dict[str, Any], host: str = BROKER_HOST) -> None:
    connection = pika.BlockingConnection(pika.ConnectionParameters(host))

    try:
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME)
        channel.basic_publish(
            exchange="",
            routing_key=QUEUE_NAME,
            body=json.dumps(data, ensure_ascii=False).encode("utf-8"),
            properties=pika.BasicProperties(
                content_type="application/json",
                content_encoding="utf-8",
            ),
        )
        print(f"Published data to queue {QUEUE_NAME}: {data}")
    finally:
        connection.close()


@repeat(getattr(every(INTERVAL_VALUE), INTERVAL_TIME))
def collect_and_publish():
    try:
        weather_data = collect_weather_data()
        publish_to_queue(weather_data)
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    print("Starting weather data collector...")
    while True:
        run_pending()
        time.sleep(1)
