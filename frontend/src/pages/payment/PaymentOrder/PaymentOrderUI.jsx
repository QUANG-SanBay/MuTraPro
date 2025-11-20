import React, { useState } from "react";
import { Receipt, Calendar, CheckCircle, Clock } from "lucide-react";
import "./PaymentOrderUI.scss";

export default function PaymentOrderUI() {
  const [activeTab, setActiveTab] = useState("unpaid");

  const orders = [
    { id: "ORD001", title: "Thu âm + Mix + Master", date: "10/10/2025", amount: 5000000, status: "unpaid" },
    { id: "ORD004", title: "Thu âm", date: "15/10/2025", amount: 2000000, status: "unpaid" },
  ];

  const transactions = [
    { transactionId: "PAY003", orderId: "ORD003", date: "14/10/2025", method: "Chuyển khoản", amount: 1500000, status: "completed" },
    { transactionId: "PAY002", orderId: "ORD002", date: "12/10/2025", method: "Ví MoMo", amount: 3000000, status: "completed" },
    { transactionId: "PAY001", orderId: "ORD001", date: "10/10/2025", method: "Chuyển khoản", amount: 5000000, status: "pending" },
  ];

  const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

  return (
    <div className="payment-ui">
      <div className="container">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "unpaid" ? "active" : ""}`}
            onClick={() => setActiveTab("unpaid")}
          >
            Chờ thanh toán (2)
          </button>
          <button
            className={`tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử giao dịch
          </button>
        </div>

        <div className="content">
          {activeTab === "unpaid" ? (
            <>
              <h2>Thanh toán đơn hàng</h2>
              <p className="description">Các đơn hàng cần thanh toán</p>

              <div className="order-list">
                {orders.map((order) => (
                  <div className="order-card" key={order.id}>
                    <div className="order-info">
                      <Receipt className="icon" />
                      <div>
                        <h3>{order.title}</h3>
                        <div className="details">
                          <span>Mã đơn: {order.id}</span>•{" "}
                          <span className="date">
                            <Calendar className="icon-small" />
                            {order.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="order-actions">
                      <div className="price">{formatCurrency(order.amount)}</div>
                      <button className="pay-btn">Thanh toán ngay</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2>Lịch sử giao dịch</h2>
              <p className="description">Xem lại các giao dịch đã thực hiện</p>

              <div className="table-wrapper">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Mã giao dịch</th>
                      <th>Mã đơn hàng</th>
                      <th>Ngày</th>
                      <th>Phương thức</th>
                      <th className="right">Số tiền</th>
                      <th className="center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.transactionId}>
                        <td>{t.transactionId}</td>
                        <td>{t.orderId}</td>
                        <td>{t.date}</td>
                        <td>{t.method}</td>
                        <td className="right">{formatCurrency(t.amount)}</td>
                        <td className="center">
                          {t.status === "completed" ? (
                            <span className="status success">
                              <CheckCircle className="icon-small" />
                              Đã thanh toán
                            </span>
                          ) : (
                            <span className="status pending">
                              <Clock className="icon-small" />
                              Chờ thanh toán
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
