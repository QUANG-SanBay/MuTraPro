// gate-way/src/middlewares/cors-config.js
const cors = require("cors");

const corsConfig = cors({
  origin: [
    "http://localhost:3000", // React dev
    "https://mutrapro.com",  // Production domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

module.exports = corsConfig;
