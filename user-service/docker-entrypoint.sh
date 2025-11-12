#!/bin/bash
set -e

echo "=== Starting Django User Service ==="

# Wait for SQL Server to be ready
echo "Waiting for SQL Server..."
until timeout 5 bash -c "</dev/tcp/$DB_HOST/$DB_PORT" 2>/dev/null; do
  echo "SQL Server is unavailable - sleeping"
  sleep 2
done
echo "SQL Server is up!"

cd /app/userService

# Always create new migrations if models changed
echo "Creating migrations..."
python manage.py makemigrations --noinput

# Apply migrations
echo "Applying migrations..."
python manage.py migrate --noinput

# Start server
echo "Starting Django development server..."
exec python manage.py runserver 0.0.0.0:8000
