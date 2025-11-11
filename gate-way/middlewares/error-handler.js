class AppError extends Error {
  constructor(status = 500, message = "Internal Server Error", code = "INTERNAL_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const notFound = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`, "ROUTE_NOT_FOUND"));
};

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_ERROR",
  });
};

module.exports = { AppError, asyncHandler, notFound, errorHandler };
