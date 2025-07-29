FROM python:3.11-slim-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir pipx && \
    python -m pipx ensurepath

ENV POETRY_VERSION=1.8.2
RUN pipx install poetry==$POETRY_VERSION

ENV POETRY_VIRTUALENVS_IN_PROJECT=false \
    POETRY_NO_INTERACTION=1 \
    PATH="/root/.local/bin:$PATH"

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root --no-dev --sync

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]