// frontend/src/components/layouts/defaultLayout/DefaultLayout.js
import React from "react";

export default function DefaultLayout({ children, type }) {
  // type="customer" đang được AppRouter truyền vào (nếu bạn muốn tùy biến theo role)
  return (
    <div className="layout-default">
      {/* Ví dụ header để bạn nhìn thấy rõ là layout đang hoạt động */}
      <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <strong>MuTraPro</strong> {type ? `• ${type}` : ""}
      </header>

      {/* QUAN TRỌNG: nơi hiển thị trang con (route element) */}
      <main style={{ padding: 16 }}>
        {children}
      </main>

      <footer style={{ padding: 12, borderTop: "1px solid #eee", marginTop: 24 }}>
        © {new Date().getFullYear()} MuTraPro
      </footer>
    </div>
  );
}
