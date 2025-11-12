const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

// Load biến môi trường
dotenv.config();

const logger = require('./middlewares/logger.js');
const corsConfig = require('./middlewares/cors-config.js');
const { notFound, errorHandler } = require('./middlewares/error-handler.js');


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
  order: process.env.ORDER_SERVICE_URL || "http://order-service:4001",
  notification:
    process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:4003",
  media: process.env.MEDIA_SERVICE_URL || "http://media-service:4004",
  management:
    process.env.MANAGEMENT_STUDIO_SERVICE_URL ||
    "http://management-studio-service:4005",
  user: process.env.USER_SERVICE_URL || "http://user-service:8000",
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

// Port từ biến môi trường
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Gateway chạy tại http://localhost:${PORT}`);
});
