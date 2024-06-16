FROM python:3.11

ENV PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false


WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN pip install --no-cache-dir poetry && \
    poetry install

