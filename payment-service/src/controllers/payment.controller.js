import { PaymentService } from "../services/payment.service.js";
import { createCardPaymentService } from '../services/paypal.service.js'

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

  async handleWebhook(req, res) {
    try {
      const { id , description, transferAmount } = req.body;
      if (!id || !description || !transferAmount) {
        return res.status(400).json({ message: "Thiếu dữ liệu từ SePay" });
      }

      const result = await PaymentService.authenticPaymentSepay({
        description,
        amount,
      });

      return res.status(200).json({
        message: "Webhook xử lý thành công",
        result,
      });
    } catch (err) {
      console.error("Lỗi xử lý webhook:", err.message);
      return res.status(500).json({ message: "Lỗi xử lý webhook" });
    }
  },

  async createCardPayment (req, res)  {
  try {
    const { orderId, totalAmount, card } = req.body

    // Kiểm tra dữ liệu đầu vào
    if (!orderId || !totalAmount || !card) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu dữ liệu: cần có orderId, totalAmount và card',
      })
    }

    const result = await createCardPaymentService({ orderId, totalAmount, card })

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Thanh toán PayPal thành công',
        data: result,
      })
    } else {
      return res.status(400).json({
        success: false,
        message: 'Thanh toán thất bại',
        error: result.message,
      })
    }
  } catch (err) {
    console.error('❌ Lỗi trong PayPal Controller:', err)
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xử lý thanh toán PayPal',
      error: err.message,
    })
  }
}
};
