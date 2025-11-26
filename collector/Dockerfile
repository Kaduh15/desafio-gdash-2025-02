FROM python:3.10-slim

WORKDIR /app

COPY pyproject.toml uv.lock .

RUN pip install uv && uv sync

COPY . .

CMD ["uv", "run", "main.py"]