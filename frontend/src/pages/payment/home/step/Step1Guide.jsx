import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';

export default function Step1Guide({ paymentMethods, onNext }) {
  return (
    <div className="card">
      <div className="card-header gradient-red">
        <div className="header-left">
          <AlertCircle size={20} color="#fff" />
          <h1>Hướng dẫn thanh toán</h1>
        </div>
      </div>

      <div className="card-body">
        <div className="notice warning">
          <div className="notice-icon"><AlertCircle size={16} /></div>
          <div>
            <div className="notice-title">Lưu ý quan trọng</div>
            <div className="notice-desc">Vui lòng đọc kỹ hướng dẫn trước khi tiến hành thanh toán để đảm bảo giao dịch thành công.</div>
          </div>
        </div>

        <div className="method-list">
          {paymentMethods.map((m) => (
            <div key={m.id} className="method-card">
              <div className="method-top">
                <div className={`method-icon ${m.colorClass}`} aria-hidden />
                <div className="method-info">
                  <div className="method-name">{m.name}</div>
                  <div className="method-desc">{m.description}</div>
                </div>
              </div>
              <div className="method-guide">
                {m.guide.map((g, idx) => (
                  <div key={idx} className="guide-row">
                    <div className="guide-index">{idx + 1}</div>
                    <div className="guide-text">{g}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary full" onClick={onNext}>
          Tiếp tục <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
