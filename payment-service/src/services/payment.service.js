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
};
