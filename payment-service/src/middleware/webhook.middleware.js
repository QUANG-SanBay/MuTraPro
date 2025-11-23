import dotenv from "dotenv";
dotenv.config();


export const verifySepayWebhook = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const expectedKey = `Apikey ${process.env.WEBHOOK_API_KEY}`;

    if (!authHeader) {
      console.warn("Thiếu header Authorization trong webhook");
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    if (authHeader !== expectedKey) {
      console.warn("Webhook bị từ chối: API key không hợp lệ");
      return res.status(403).json({ message: "Invalid API key" });
    }
    
    next();
  } catch (error) {
    console.error("Lỗi trong verifySepayWebhook:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};