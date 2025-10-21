import express from "express";
import { PaymentController } from "../controllers/payment.controller.js";

const router = express.Router();


router.post("/checkout", PaymentController.checkout);
router.post("/webhook", PaymentController.handleWebhook);

export default router;
