import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import { connectRabbitMQ } from "./config/rabbit.js"
import "./models/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4002;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello, Express Payment Service is running");
});


app.listen(port, "0.0.0.0", async () => {
  await connectRabbitMQ();
  console.log(`Payment service listening on port ${port}`);
});
