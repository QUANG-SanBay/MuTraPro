import { PaymentService } from "../services/payment.service.js";

export const PaymentController = {

  async checkout(req, res) {
    try {
      const { orderId, totalAmount, paymentMethod } = req.body;

      if (!orderId || !totalAmount || !paymentMethod) {
        return res.status(400).json({
          message: "Thiếu thông tin bắt buộc (orderId, totalAmount, paymentMethod)",
        });
      }


      const paymentData = await PaymentService.createPaymentIntent({
        orderId,
        totalAmount,
        paymentMethod,
      });

      return res.status(200).json({
        success: true,
        message: "Tạo yêu cầu thanh toán thành công",
        data: paymentData,
      });
    } catch (error) {
      console.error("[PaymentController.checkout] Lỗi:", error.message);
      return res.status(500).json({
        success: false,
        message: "Tạo thanh toán thất bại",
      });
    }
  },
};
