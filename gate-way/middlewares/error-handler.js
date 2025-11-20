// gate-way/middlewares/error-handler.js

class AppError extends Error {
  constructor(status = 500, message = "Internal Server Error", code = "INTERNAL_ERROR", details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Bọc async để tự catch(next)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 404 cho route không khớp (THÊM HÀM NÀY)
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

// Handler lỗi tổng
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const payload = {
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_ERROR",
  };

  if (process.env.NODE_ENV !== "production") {
    if (err.details) payload.details = err.details;
    if (err.stack) payload.stack = err.stack;
  }

  console.error(`[Gateway ERROR] ${req.method} ${req.originalUrl}`, err.stack || err);
  res.status(status).json(payload);
};

module.exports = { AppError, asyncHandler, notFound, errorHandler };
