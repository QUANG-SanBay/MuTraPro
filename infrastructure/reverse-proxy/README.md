# Reverse Proxy (Nginx)

- Phục vụ **React build** từ `/usr/share/nginx/html`.
- Proxy:
  - `/api/*` → Gateway service (`gateway:8000`)
  - `/ws` → WebSocket (STOMP) qua Gateway

## Dùng với docker-compose
1) Build frontend (production):
cd frontend
npm ci
npm run build
2) Mount `frontend/build` vào container Nginx hoặc COPY trong Dockerfile.

## Gợi ý healthcheck (compose)
healthcheck:
test: ["CMD", "wget", "-qO-", "http://localhost"]
interval: 10s
timeout: 5s
retries: 10