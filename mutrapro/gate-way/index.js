const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Load biến môi trường
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Middleware log request
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy routes
app.use(
  "/payment",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL || "http://payment-service:4002",
    changeOrigin: true,
    pathRewrite: { "^/payment": "" },
  })
);

// Port từ biến môi trường
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Gateway chạy tại http://localhost:${PORT}`);
});
