import React from 'react';
import OrderSummary from '../order/OrderSummary';
import QRCodePayment from '../form/QRCodePayment';
import CreditCardForm from '../form/CreditCardForm';
import BankTransferInfo from '../form/BankTransferInfo';

export default function Step3PaymentMethod({
  paymentMethods,
  orderData,
  subtotal,
  total,
  formatCurrency,
  selectedMethod,
  setSelectedMethod,
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  onBack
}) {
  return (
    <div className="grid-3">
      <div className="col-main">
        <div className="card">
          <div className="card-header gradient-red">
            <div className="header-left">
              <div className="num-box">3</div>
              <h1>Phương thức thanh toán</h1>
            </div>
          </div>

          <div className="card-body">
            <div className="method-select-list">
              {paymentMethods.map(m => (
                <button
                  key={m.id}
                  className={`method-select ${selectedMethod === m.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod(m.id)}
                >
                  <div className={`method-icon ${m.colorClass}`}></div>
                  <div className="method-info">
                    <div className="method-name">{m.name}</div>
                    <div className="method-desc">{m.description}</div>
                  </div>
                  {selectedMethod === m.id && <div className="method-checked">✓</div>}
                </button>
              ))}
            </div>

            <div className="method-form-area">
              {selectedMethod === 'credit-card' && (
                <CreditCardForm
                  cardNumber={cardNumber}
                  onCardNumberChange={setCardNumber}
                  cardName={cardName}
                  onCardNameChange={setCardName}
                  expiry={expiry}
                  onExpiryChange={setExpiry}
                  cvv={cvv}
                  onCvvChange={setCvv}
                  total={total}
                  formatCurrency={formatCurrency}
                />
              )}

              {selectedMethod === 'qr-code' && (
                <QRCodePayment total={total} formatCurrency={formatCurrency} />
              )}

              {selectedMethod === 'bank-transfer' && (
                <BankTransferInfo orderNumber={orderData.orderNumber} total={total} formatCurrency={formatCurrency} />
              )}
            </div>

            <div className="action-row">
              <button className="btn btn-outline" onClick={onBack}>Quay lại</button>
              <button
                className={`btn btn-primary ${!selectedMethod ? 'disabled' : ''}`}
                onClick={() => {
                  if (!selectedMethod) { alert('Vui lòng chọn phương thức thanh toán'); return; }
                  alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
                }}
                disabled={!selectedMethod}
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>

          <div className="card-footer small muted">
            DỊCH VỤ THANH TOÁN TRỰC TUYẾN SEPAY | 13 Đường 38, Khu đô Thị Vạn Phúc, Thủ Đức, Thành phố Hồ Chí Minh
          </div>
        </div>
      </div>

      <div className="col-side">
        <OrderSummary orderData={orderData} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
}
