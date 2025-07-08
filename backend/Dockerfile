FROM python:3.12-slim

COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
VOLUME ["/app"]
WORKDIR /app/
CMD ["fastapi", "dev","main.py",  "--port=8000","--host","0.0.0.0"]