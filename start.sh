#!/bin/sh
set -e

echo "Running database migrations..."
python3 -m alembic upgrade head

echo "Starting FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000