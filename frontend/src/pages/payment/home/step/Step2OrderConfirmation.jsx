import React from 'react';
import OrderSummary from '../order/OrderSummary';
import { ShoppingCart, Package, Truck, Clock } from 'lucide-react';

export default function Step2OrderConfirmation({ orderData, formatCurrency, onBack, onNext }) {
  return (
    <div className="grid-3">
      <div className="col-main">
        <div className="card">
          <div className="card-header gradient-blue">
            <div className="header-left">
              <ShoppingCart size={20} color="#fff" />
              <h1>Xác nhận đơn hàng</h1>
            </div>
          </div>

          <div className="card-body">
            <div className="order-top">
              <div className="order-title">Thông tin đơn hàng</div>
              <div className="order-number">#{orderData.orderNumber}</div>
            </div>

            <div className="order-items">
              {orderData.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-thumb">{item.image}</div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-qty">Số lượng: {item.quantity}</div>
                  </div>
                  <div className="item-price">
                    <div>{formatCurrency(item.price * item.quantity)}</div>
                    <div className="small">{formatCurrency(item.price)}/sp</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="shipping-info">
              <div className="shipping-title">Thông tin giao hàng</div>
              <div className="shipping-card">
                <div className="ship-row"><Package size={16} /> <span>Nguyễn Văn A - 0912345678</span></div>
                <div className="ship-row"><Truck size={16} /> <span>123 Đường ABC, Quận 1, TP.HCM</span></div>
                <div className="ship-row"><Clock size={16} /> <span>Giao hàng tiêu chuẩn (3-5 ngày)</span></div>
              </div>
            </div>

            <div className="action-row">
              <button className="btn btn-outline" onClick={onBack}>Quay lại</button>
              <button className="btn btn-primary" onClick={onNext}>Xác nhận & Thanh toán</button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-side">
        <OrderSummary orderData={orderData} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
}
