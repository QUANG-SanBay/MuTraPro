import { connectRabbitMQ, getChannel } from "../config/rabbit.js";

async function main() {
  // 1. Kết nối RabbitMQ
  await connectRabbitMQ();
  const channel = getChannel();

  // 2. Tạo queue (nếu chưa có)
  const queue = "payment_queue";
  await channel.assertQueue(queue, { durable: true });

  // 3. Gửi test message (publish)
  const message = { orderId: 101, status: "SUCCESS" };
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log("📤 Test message sent:", message);

  // 4. Nhận message (consume)
  channel.consume(queue, (msg) => {
    if (msg) {
      console.log("📥 Message received:", msg.content.toString());
      channel.ack(msg); // Xác nhận đã nhận
    }
  });
}

main().catch(console.error);
