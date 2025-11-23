const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const http = require("http");
const WebSocket = require("ws");

// Load biến môi trường
dotenv.config();

const logger = require('./middlewares/logger.js');
const corsConfig = require('./middlewares/cors-config.js');
const { notFound, errorHandler } = require('./middlewares/error-handler.js');
const rabbitmqBridge = require('./services/rabbitmq-websocket.js');


const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(logger);
app.use(corsConfig);
app.use(rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true }));

// CORS setup: không dùng "*" khi credentials=true để tránh lỗi trình duyệt
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có Origin (VD: curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin ${origin}`));
    },
    credentials: true,
  })
);
// Không cần đăng ký riêng OPTIONS với pattern '*', cors middleware phía trên đã xử lý preflight

// Rate limit để tránh bị spam vào 1 endpoint duy nhất
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 120, // tối đa 120 request/phút/client
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware log request
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Bản đồ Service từ ENV -> URL nội bộ trong docker network
const serviceMap = {
  payment: process.env.PAYMENT_SERVICE_URL || "http://payment-service:4002",
  "payment-service": process.env.PAYMENT_SERVICE_URL || "http://payment-service:4002",
  order: process.env.ORDER_SERVICE_URL || "http://order-service:4001",
  "order-service": process.env.ORDER_SERVICE_URL || "http://order-service:4001",
  notification:
    process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:4003",
  "notification-service":
    process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:4003",
  media: process.env.MEDIA_SERVICE_URL || "http://media-service:4004",
  "media-service": process.env.MEDIA_SERVICE_URL || "http://media-service:4004",
  management:
    process.env.MANAGEMENT_STUDIO_SERVICE_URL ||
    "http://management-studio-service:4005",
  "management-studio-service":
    process.env.MANAGEMENT_STUDIO_SERVICE_URL ||
    "http://management-studio-service:4005",
  user: process.env.USER_SERVICE_URL || "http://user-service:8000",
  "user-service": process.env.USER_SERVICE_URL || "http://user-service:8000",
};

// Health check đơn giản
app.get("/health", (req, res) => {
  return res.json({ status: "ok", time: new Date().toISOString() });
});

// Endpoint duy nhất để frontend gọi
// Contract:
// POST /api
// {
//   "service": "payment|order|notification|media|management|user",
//   "path": "/duong-dan-cua-service",
//   "method": "GET|POST|PUT|PATCH|DELETE", // default GET
//   "query": { ... },
//   "headers": { ... },
//   "body": { ... } // dữ liệu gửi đi, nếu có
// }
app.post("/api", async (req, res) => {
  try {
    const { service, path, method = "GET", query, headers = {}, body } =
      req.body || {};

    // Validate input cơ bản
    if (!service || !path) {
      return res.status(400).json({
        error: "Thiếu trường bắt buộc: 'service' và 'path'",
      });
    }

    const baseUrl = serviceMap[service];
    if (!baseUrl) {
      return res
        .status(400)
        .json({ error: `Service không hợp lệ: ${service}` });
    }

    // Hợp nhất header, bảo toàn Authorization và Cookie nếu có
    const forwardHeaders = {
      ...(headers || {}),
      Authorization: req.headers["authorization"] || headers["Authorization"],
      Cookie: req.headers["cookie"] || headers["Cookie"],
      "x-forwarded-by": "gateway",
    };

    // Tạo URL đích
    const url = new URL(path, baseUrl).toString();

    // Gọi xuống service bằng axios
    const response = await axios({
      url,
      method: method.toUpperCase(),
      params: query,
      data: body,
      headers: forwardHeaders,
      // timeout có thể điều chỉnh theo nhu cầu
      timeout: 30000,
      validateStatus: () => true, // để tự mình trả status xuống client
    });

    // Forward status + body về client
    res.status(response.status);

    // Đảm bảo content-type được giữ nguyên nếu có
    const contentType = response.headers["content-type"];
    if (contentType) {
      res.setHeader("content-type", contentType);
    }

    return res.send(response.data);
  } catch (err) {
    console.error("[Gateway ERROR]", err?.message || err);
    const status = err?.response?.status || 500;
    const data =
      err?.response?.data ||
      ({ error: "Lỗi không xác định tại Gateway", detail: err?.message });
    return res.status(status).send(data);
  }
});

app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server for live events
const wss = new WebSocket.Server({ 
  server,
  path: '/ws/events'
});

wss.on('connection', (ws, req) => {
  console.log(`[WebSocket] New client connected from ${req.socket.remoteAddress}`);
  
  // Register client with RabbitMQ bridge
  rabbitmqBridge.addClient(ws);
  
  // Handle ping/pong for keepalive
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  // Handle client messages (optional)
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('[WebSocket] Received message from client:', data);
      
      // Handle different message types if needed
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
      } else if (data.type === 'status') {
        const status = rabbitmqBridge.getStatus();
        ws.send(JSON.stringify({ type: 'status', data: status }));
      }
    } catch (error) {
      console.error('[WebSocket] Error parsing client message:', error.message);
    }
  });
});

// WebSocket keepalive - ping clients every 30 seconds
const keepaliveInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('[WebSocket] Terminating inactive client');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(keepaliveInterval);
});

// WebSocket status endpoint
app.get('/ws/status', (req, res) => {
  const status = rabbitmqBridge.getStatus();
  return res.json({
    ...status,
    websocketClients: wss.clients.size
  });
});

// Initialize RabbitMQ connection
rabbitmqBridge.connect().catch((error) => {
  console.error('[Gateway] Failed to initialize RabbitMQ bridge:', error);
});

// Port từ biến môi trường
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Gateway chạy tại http://localhost:${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws/events`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Gateway] SIGTERM received, shutting down gracefully...');
  
  wss.close(() => {
    console.log('[Gateway] WebSocket server closed');
  });
  
  await rabbitmqBridge.close();
  
  server.close(() => {
    console.log('[Gateway] HTTP server closed');
    process.exit(0);
  });
});
