FROM python:3.10-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml ./

RUN uv sync

COPY . .

CMD [".venv/bin/python", "-u", "main.py"]