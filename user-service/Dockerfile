FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY . /app

# Cài đặt dependency cơ bản + Microsoft ODBC driver 17
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    apt-transport-https \
    build-essential \
    unixodbc-dev \
    && curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg \
    && install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/ \
    && sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/debian/12/prod bookworm main" > /etc/apt/sources.list.d/mssql-release.list' \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && rm -rf /var/lib/apt/lists/* microsoft.gpg

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

WORKDIR /app/userService
ENTRYPOINT ["/docker-entrypoint.sh"]