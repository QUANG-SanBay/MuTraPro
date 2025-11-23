import React from 'react';
import { QrCode } from 'lucide-react';

export default function QRCodePayment({ total, formatCurrency }) {
  return (
    <div className="card qr-card">
      <div className="qr-box">
        <div className="qr-inner">
          <QrCode size={120} />
        </div>
      </div>
      <h3>Quét mã QR để thanh toán</h3>
      <p>Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã</p>
      <div className="amount inline">
        <span>Số tiền:</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
    </div>
  );
}
