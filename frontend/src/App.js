import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppRouter from "./routers/AppRouter";
import GlobalStyles from "./assets/css/globalstyles/GlobalStyles";
import { useState, useEffect } from "react";
import axios from "axios";

import OrderPage from "./pages/OrderPage";
import "./App.css";

// Các components quản lý mới
import RequestIntakePage from "./pages/RequestIntakePage"; 
import AssignmentPage from "./pages/AssignmentPage";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/auth/api/hello")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <GlobalStyles>
      <Router>
        <div className="p-6 font-sans">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            MuTraPro Frontend
          </h1>
          <p className="mb-4 text-gray-700">Backend says: {message}</p>

          <nav className="space-x-4 mb-6">
            <Link
              to="/"
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Home
            </Link>
            <Link
              to="/order"
              className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
            >
              Đặt hàng
            </Link>
            <Link
              to="/requests"
              className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Tiếp nhận Yêu cầu
            </Link>
            <Link
              to="/assignments"
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Phân công Nhiệm vụ
            </Link>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h3 className="text-lg font-semibold">Welcome to MuTraPro!</h3>
                  <p className="text-gray-600 mt-2">
                    Hệ thống đặt hàng dịch vụ thu âm & upload thông minh.
                  </p>
                </div>
              }
            />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/requests" element={<RequestIntakePage />} />
            <Route path="/assignments" element={<AssignmentPage />} />
          </Routes>

          {/* Giữ AppRouter nếu cần dùng */}
          <AppRouter />
        </div>
      </Router>
    </GlobalStyles>
  );
}

export default App;
