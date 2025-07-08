# Stage 1: Build the application
FROM python:3.12-slim AS builder

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Stage 2: Development environment
FROM python:3.12-slim AS dev

WORKDIR /app

COPY --from=builder /app /app

CMD ["fastapi", "dev", "--port=8000", "--host", "0.0.0.0"]

# Stage 3: Production environment
FROM python:3.12-slim AS prod

WORKDIR /app

COPY --from=builder /app /app

CMD ["fastapi", "run","main.py", "--port=8000", "--host", "0.0.0.0"]
