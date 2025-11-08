import React from 'react';

export default function BankTransferInfo({ orderNumber, total, formatCurrency }) {
  return (
    <div className="card">
      {/* <h3>Thông tin chuyển khoản</h3> */}
      <div className="bank-card">
        <div className="bank-row"><span>Ngân hàng:</span><strong>Vietcombank</strong></div>
        <div className="bank-row"><span>Số tài khoản:</span><strong>1234567890</strong></div>
        <div className="bank-row"><span>Chủ tài khoản:</span><strong>SEPAY</strong></div>
        <div className="bank-row"><span>Số tiền:</span><strong className="text-red">{formatCurrency(total)}</strong></div>
        <div className="bank-row"><span>Nội dung:</span><strong>SEVQR{orderNumber}</strong></div>
      </div>

      <div className="notice warning small mt-3">
        Vui lòng chuyển khoản đúng nội dung <strong>SEVQR + {orderNumber}</strong> để đơn hàng được xử lý chính xác nhất
      </div>
    </div>
  );
}
