// gate-way/src/middlewares/logger.js
const morgan = require("morgan");

// Ghi log chi tiết request (method, url, status, response time)
const logger = morgan(":method :url :status :response-time ms");

module.exports = logger;
