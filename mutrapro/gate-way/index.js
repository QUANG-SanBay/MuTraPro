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
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:8080", // Auth Service
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
  })
);

// Port từ biến môi trường
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway chạy tại http://localhost:${PORT}`);
});
