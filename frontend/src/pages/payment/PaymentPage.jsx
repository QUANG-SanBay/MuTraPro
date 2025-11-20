import React, { useState } from 'react';
import { AlertCircle, ShoppingCart, CreditCard } from 'lucide-react';
import StepsHeader from './home/step/StepsHeader';
import Step1Guide from './home/step/Step1Guide';
import Step2OrderConfirmation from './home/step/Step2OrderConfirmation';
import Step3PaymentMethod from './home/step/Step3PaymentMethod';
import './Payment.scss'; 

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Thẻ tín dụng / Thẻ ghi nợ',
      description: 'Visa, Mastercard, JCB',
      icon: 'credit-card',
      colorClass: 'pm-blue',
      guide: [
        'Nhập đầy đủ thông tin thẻ của bạn',
        'Đảm bảo thẻ đã được kích hoạt thanh toán online',
        'Nhập đúng mã CVV (3 số ở mặt sau thẻ)',
        'Xác nhận giao dịch qua SMS/App ngân hàng'
      ]
    },
    {
      id: 'qr-code',
      name: 'QR Pay',
      description: 'Quét mã QR để thanh toán',
      icon: 'qr-code',
      colorClass: 'pm-purple',
      guide: [
        'Mở ứng dụng ngân hàng hoặc ví điện tử',
        'Chọn chức năng quét mã QR',
        'Quét mã QR hiển thị trên màn hình',
        'Xác nhận thông tin và hoàn tất thanh toán'
      ]
    },
    {
      id: 'bank-transfer',
      name: 'Chuyển khoản ngân hàng',
      description: 'ATM - iBanking',
      icon: 'bank',
      colorClass: 'pm-green',
      guide: [
        'Đăng nhập vào ứng dụng ngân hàng',
        'Chọn chuyển khoản và nhập thông tin tài khoản',
        'Nhập CHÍNH XÁC nội dung chuyển khoản',
        'Xác nhận và hoàn tất giao dịch'
      ]
    }
  ];

  const orderData = {
    orderNumber: 'DH' + Math.floor(Math.random() * 1000000),
    items: [
      { id: 1, name: 'Áo thun nam basic', quantity: 2, price: 199000, image: '👕' },
      { id: 2, name: 'Quần jean slim fit', quantity: 1, price: 450000, image: '👖' },
      { id: 3, name: 'Giày sneaker trắng', quantity: 1, price: 650000, image: '👟' }
    ],
    shipping: 30000,
    discount: 50000
  };

  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + orderData.shipping - orderData.discount;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // helpers for card formatting (kept simple, can be moved to util)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) parts.push(v.substring(i, i + 4));
    return parts.join(' ');
  };
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length <= 2) return v;
    return v.substring(0,2) + '/' + v.substring(2,4);
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) setCardNumber(formatted);
  };
  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) setExpiry(formatted);
  };

  const steps = [
    { number: 1, name: 'Hướng dẫn', icon: AlertCircle },
    { number: 2, name: 'Xác nhận đơn hàng', icon: ShoppingCart },
    { number: 3, name: 'Thanh toán', icon: CreditCard }
  ];

  return (
    <div className="payment-page root-bg">
      <div className="container">
        <StepsHeader steps={steps} currentStep={currentStep} />

        {currentStep === 1 && (
          <Step1Guide
            paymentMethods={paymentMethods}
            onNext={() => { setCurrentStep(2); window.scrollTo(0,0); }}
          />
        )}

        {currentStep === 2 && (
          <Step2OrderConfirmation
            orderData={orderData}
            formatCurrency={formatCurrency}
            onBack={() => { setCurrentStep(1); window.scrollTo(0,0); }}
            onNext={() => { setCurrentStep(3); window.scrollTo(0,0); }}
          />
        )}

        {currentStep === 3 && (
          <Step3PaymentMethod
            paymentMethods={paymentMethods}
            orderData={orderData}
            subtotal={subtotal}
            total={total}
            formatCurrency={formatCurrency}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            cardNumber={cardNumber}
            setCardNumber={handleCardNumberChange}
            cardName={cardName}
            setCardName={(v) => setCardName(v.toUpperCase())}
            expiry={expiry}
            setExpiry={handleExpiryChange}
            cvv={cvv}
            setCvv={(v) => setCvv(v.replace(/[^0-9]/gi,''))}
            onBack={() => { setCurrentStep(2); window.scrollTo(0,0); }}
          />
        )}
      </div>
    </div>
  );
}
