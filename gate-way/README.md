# Gateway

Gateway này được refactor để frontend chỉ cần gọi 1 endpoint duy nhất.

## Endpoint duy nhất

- URL: `POST /api`
- Body (JSON):

```
{
  "service": "payment|order|notification|media|management|user",
  "path": "/duong-dan-cua-service",
  "method": "GET|POST|PUT|PATCH|DELETE",  // mặc định: GET
  "query": { ... },                         // tuỳ chọn
  "headers": { ... },                       // tuỳ chọn; sẽ merge với Authorization/Cookie từ client nếu có
  "body": { ... }                           // tuỳ chọn cho các method có body
}
```

- Ví dụ gọi payment-service:

```
POST /api
{
  "service": "payment",
  "path": "/health",
  "method": "GET"
}
```

- Ví dụ tạo đơn hàng qua order-service:

```
POST /api
{
  "service": "order",
  "path": "/orders",
  "method": "POST",
  "body": {
    "items": [ ... ],
    "userId": 123
  }
}
```

## Bản đồ service

Các URL nội bộ có thể cấu hình qua biến môi trường hoặc file `.env`:

- `PAYMENT_SERVICE_URL` (mặc định `http://payment-service:4002`)
- `ORDER_SERVICE_URL` (mặc định `http://order-service:4001`)
- `NOTIFICATION_SERVICE_URL` (mặc định `http://notification-service:4003`)
- `MEDIA_SERVICE_URL` (mặc định `http://media-service:4004`)
- `MANAGEMENT_STUDIO_SERVICE_URL` (mặc định `http://management-studio-service:4005`)
- `USER_SERVICE_URL` (mặc định `http://user-service:8000`)

## Gợi ý tích hợp frontend

```js
const callApi = async ({ service, path, method = 'GET', query, body }) => {
  const res = await fetch('http://localhost:8000/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service, path, method, query, body })
  });
  if (!res.ok) throw new Error(`Gateway error ${res.status}`);
  return res.json();
};

// Ví dụ:
callApi({ service: 'payment', path: '/health', method: 'GET' })
  .then(console.log)
  .catch(console.error);
```

## Health check

- `GET /health` -> `{ status: "ok", time: "..." }`

## Bảo mật và giới hạn

- Đã bật rate-limit 120 request/phút/IP cho toàn bộ gateway. Điều chỉnh trong `index.js` nếu cần.
- Gateway sẽ forward header `Authorization` và `Cookie` từ client xuống service đích.
