import express from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { verifySepayWebhook } from "../middleware/webhook.middleware.js"

const router = express.Router();


router.post("/checkout", PaymentController.checkout);
router.post("/webhook" , verifySepayWebhook, PaymentController.handleWebhook);

export default router;
