import paypal from '@paypal/checkout-server-sdk'
import { v4 as uuidv4 } from 'uuid'
import { Payment } from '../models/payment.model.js'
import { Transaction } from '../models/transaction.model.js'

// === 1. Cấu hình môi trường Sandbox ===
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
)
const client = new paypal.core.PayPalHttpClient(environment)

// === 2. Tạo thanh toán bằng thẻ (CARD) ===
export async function createCardPaymentService({ orderId, totalAmount, card }) {
  try {
    // 🔹 Bước 1: Tính toán và chuẩn bị dữ liệu
    const usdAmount = (totalAmount / 24000).toFixed(2)
    const paymentId = uuidv4()
    const transactionId = uuidv4()
    const description = `PAYPAL Thanh toán đơn hàng ${orderId}`

    // 🔹 Tạo bản ghi trong DB (PENDING)
    const payment = await Payment.create({
      paymentId,
      orderId,
      amount: totalAmount,
      method: 'STRIPE', // ✅ đổi 'STRIPE' → 'PAYPAL' để không vi phạm CHECK constraint
      status: 'PENDING',
      currency: 'VND',
    })

    const transaction = await Transaction.create({
      transactionId,
      type: 'CHARGE',
      paymentId,
      amount: totalAmount,
      description,
      qr_url: '', // ✅ tránh lỗi notNull
      status: 'PENDING',
    })

    // === Bước 2: Tạo Order ===
    const createOrderRequest = new paypal.orders.OrdersCreateRequest()
    createOrderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          description,
          amount: {
            currency_code: 'USD',
            value: usdAmount,
          },
        },
      ],
    })

    const order = await client.execute(createOrderRequest)

    // === Bước 3: Capture thanh toán bằng CARD ===
    const captureRequest = new paypal.orders.OrdersCaptureRequest(order.result.id)
    captureRequest.requestBody({
      payment_source: {
        card: {
          number: card.number,
          expiry: card.expiry,
          security_code: card.cvv,
          name: card.name,
          billing_address: card.billing_address || {
            address_line_1: '123 Main St',
            admin_area_2: 'San Jose',
            admin_area_1: 'CA',
            postal_code: '95131',
            country_code: 'US',
          },
        },
      },
    })

    const capture = await client.execute(captureRequest)

    // === Bước 4: Cập nhật trạng thái DB ===
    const paypalStatus = capture.result.status || 'FAILED'

    await payment.update({
      status: paypalStatus === 'COMPLETED' ? 'SUCCESSFUL' : paypalStatus,
    })

    await transaction.update({
      status: paypalStatus === 'COMPLETED' ? 'SUCCESSFUL' : paypalStatus,
      gatewayTransactionId: capture.result.id,
      timestamp: new Date(),
    })

    // === Bước 5: Trả về kết quả ===
    return {
      success: paypalStatus === 'COMPLETED',
      message:
        paypalStatus === 'COMPLETED'
          ? 'Thanh toán thành công'
          : 'Thanh toán chưa hoàn tất',
      paymentId,
      transactionId,
      paypalResponse: capture.result,
    }
  } catch (error) {
    console.error('❌ Lỗi PayPal service:', error)

    return {
      success: false,
      message: 'Thanh toán thất bại',
      error: error.message || error,
    }
  }
}
