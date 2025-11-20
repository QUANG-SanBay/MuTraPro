import React from 'react';

export default function CreditCardForm({
  cardNumber,
  onCardNumberChange,
  cardName,
  onCardNameChange,
  expiry,
  onExpiryChange,
  cvv,
  onCvvChange,
  total,
  formatCurrency
}) {
  return (
    <div className="card small">
      <div className="form-row">
        <label>Số thẻ</label>
        <input type="text" value={cardNumber} onChange={(e) => onCardNumberChange(e)} placeholder="1234 5678 9012 3456" />
      </div>

      <div className="form-row">
        <label>Tên chủ thẻ</label>
        <input type="text" value={cardName} onChange={(e) => onCardNameChange(e.target.value)} placeholder="NGUYEN VAN A" />
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label>Ngày hết hạn</label>
          <input type="text" value={expiry} onChange={(e) => onExpiryChange(e)} placeholder="MM/YY" />
        </div>
        <div className="form-row">
          <label>CVV</label>
          <input type="text" value={cvv} onChange={(e) => onCvvChange(e.target.value.slice(0,3))} placeholder="123" />
        </div>
      </div>

      <div className="card-logos">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
        <img src="https://th.bing.com/th/id/R.88f7150def3b9b0f62a532244426fc14?rik=oMtZKSuBEb%2frsg&riu=http%3a%2f%2fcdn1.tnwcdn.com%2fwp-content%2fblogs.dir%2f1%2ffiles%2f2014%2f04%2fScreen-Shot-2014-04-30-at-18.18.55.png&ehk=cVVxkeWChurvuyiOf7RHsKoXDoJu1bX0abtn0%2fOqI7I%3d&risl=&pid=ImgRaw&r=0" alt="JCB" />
      </div>

      <div className="amount">
        <span>Số tiền:</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      <div className="notice warning small mt-3">
        Nhà cung cấp dịch vụ PAYPAL
      </div>
    </div>
  );
}
