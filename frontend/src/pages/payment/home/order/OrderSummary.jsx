import React from 'react';

export default function OrderSummary({ orderData, formatCurrency }) {
  const subtotal = orderData.items.reduce((s, it) => s + it.price * it.quantity, 0);
  const total = subtotal + orderData.shipping - orderData.discount;

  return (
    <div className="card summary-card">
      <div className="summary-title">Tổng quan đơn hàng</div>
      <div className="summary-body">
        {/* <div className="row"><span>Tạm tính:</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="row"><span>Phí vận chuyển:</span><span>{formatCurrency(orderData.shipping)}</span></div>
        <div className="row discount"><span>Giảm giá:</span><span>-{formatCurrency(orderData.discount)}</span></div> */}
        <div className="row total"><span>Tổng đơn hàng:</span><span>{formatCurrency(subtotal)}</span></div>
      </div>
      <div className="order-code">
        <div className="small">Mã đơn hàng:</div>
        <div className="code">#{orderData.orderNumber}</div>
      </div>
    </div>
  );
}
