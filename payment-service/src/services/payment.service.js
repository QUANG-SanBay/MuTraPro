import { v4 as uuidv4 } from 'uuid';
import { Payment } from "../models/payment.model.js";
import { Transaction } from "../models/transaction.model.js";

export const PaymentService = {
  async createPaymentIntent({ orderId, totalAmount, paymentMethod}) {
    try {
      const paymentId = uuidv4();
      const transactionId = uuidv4();

      const description = `SEVQR Thanh toán đơn hàng ${orderId}`;

      const bankShortName = process.env.BANK_SHORT_NAME;
      const accountNumber = process.env.ACCOUNT_NUMBER;

      const encodedDescription = encodeURIComponent(description);

      const qrUrl = `https://qr.sepay.vn/img?acc=${accountNumber}&bank=${bankShortName}&amount=${totalAmount}&des=${encodedDescription}&template=compact`;

      const payment = await Payment.create({
        paymentId: paymentId,
        orderId: orderId,
        amount: totalAmount,
        method: paymentMethod,
        status: "PENDING",
        currency:"VND"
      });

       const transaction = await Transaction.create({
         transactionId:transactionId,
         type:"CHARGE",
         paymentId: paymentId,
         amount: totalAmount,
         qr_url:qrUrl,
         description:description,
         status:"PENDING"
       });

      return {
        paymentId,
        orderId,
        transactionId,
        status:"PENDING",
        qrUrl,
      };
    } catch (err) {
      console.error("Lỗi khi tạo payment intent:", err.message);
      throw new Error("Tạo thanh toán thất bại");
    }
  },

  async authenticPaymentSepay({ id, description, amount }) {
  try {
    const orderIdMatch = description.match(/don hang ([a-f0-9]{32})/i);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    if (!orderId) {
      throw new Error("Không tìm thấy orderId trong nội dung giao dịch");
    }

    const payment = await Payment.findOne({ where: { orderId } });
    if (!payment) {
      throw new Error("Không tìm thấy Payment tương ứng");
    }

    if (Number(amount) !== Number(payment.amount)) {
      throw new Error("Số tiền không khớp");
    }

    await payment.update({ status: "SUCCESSFUL" });
    await Transaction.update(
      { status: "SUCCESSFUL", gatewayTransactionId: id ,timestamp: new Date() },
      { where: { paymentId: payment.paymentId } }
    );

    console.log(`Xác thực thành công cho đơn hàng ${orderId}`);
    return { orderId, status: "SUCCESSFUL" };

  } catch (error) {
    console.error("authenticPaymentSepay error:", error.message);
    throw error;
  }
},

};
