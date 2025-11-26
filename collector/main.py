from datetime import datetime, timezone
import json
import pika
import time
from schedule import repeat, every, run_pending
from dotenv import load_dotenv
from httpxfetch import httpx
from env import (
    API_KEY_OPENWEATHER,
    BROKER_HOST,
    BROKER_PASSWORD,
    BROKER_QUEUE,
    BROKER_USER,
    CITY,
    SCHEDULER_INTERVAL_MINUTES,
)

load_dotenv()


def connect_to_broker():
    conn = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=BROKER_HOST,
            credentials=pika.PlainCredentials(BROKER_USER, BROKER_PASSWORD),
        ),
    )

    channel = conn.channel()
    channel.queue_declare(queue=BROKER_QUEUE, durable=True)

    return conn, channel


def fetch_weather_data():
    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": CITY,
        "appid": API_KEY_OPENWEATHER,
        "units": "metric",
    }

    response = httpx.get(url, params=params)

    print(response.url)

    if response.status_code != 200:
        raise Exception(
            f"Error fetching weather data: {response.status_code} - {response.text}"
        )

    return response.json()


def fetch_forecast():
    url = "https://api.openweathermap.org/data/2.5/forecast"
    params = {
        "q": CITY,
        "appid": API_KEY_OPENWEATHER,
        "units": "metric",
    }
    response = httpx.get(url, params=params)

    print(response.url)

    if response.status_code != 200:
        raise Exception(
            f"Error fetching forecast data: {response.status_code} - {response.text}"
        )

    return response.json()


def build_payload(current_data, forecast_data):
    payload = {
        "metadata": {
            "collected_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "provider": "openweather"
        },
        "location": {
            "city": current_data["name"],
            "country": current_data["sys"]["country"],
            "lat": current_data["coord"]["lat"],
            "lon": current_data["coord"]["lon"]
        },
        "current": {
            "timestamp": datetime.fromtimestamp(current_data["dt"]).isoformat() + "Z",
            "temperature_c": current_data["main"]["temp"],
            "feels_like_c": current_data["main"]["feels_like"],
            "humidity_pct": current_data["main"]["humidity"],
            "wind_kmh": current_data["wind"]["speed"] * 3.6,
            "condition": current_data["weather"][0]["description"]
        },
        "forecast_hours": []
    }

    for item in forecast_data["list"][:24]:
        payload["forecast_hours"].append({
            "timestamp": datetime.fromtimestamp(item["dt"]).isoformat() + "Z",
            "temperature_c": item["main"]["temp"],
            "humidity_pct": item["main"]["humidity"],
            "wind_kmh": item["wind"]["speed"] * 3.6,
            "condition": item["weather"][0]["description"],
            "rain_probability_pct": round(item.get("pop", 0) * 100)
        })

    return payload


def publish_message(channel, message: str):
    channel.basic_publish(
        exchange="",
        routing_key=BROKER_QUEUE,
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2,
        ),
    )
    print("[x] Sent message to broker")


@repeat(every(SCHEDULER_INTERVAL_MINUTES).minutes)
def main():
    current_data = fetch_weather_data()
    forecast_data = fetch_forecast()

    payload = build_payload(current_data, forecast_data)

    conn, channel = connect_to_broker()
    publish_message(channel, json.dumps(payload, ensure_ascii=False))
    conn.close()
    
    print(json.dumps(payload, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    print("Starting weather data collector...")
    while True:
        run_pending()
        time.sleep(1)
