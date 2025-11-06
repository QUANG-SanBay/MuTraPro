import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import OrderPage from "./pages/OrderPage";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/auth/api/hello")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>MuTraPro Frontend</h1>
        <p>Backend says: {message}</p>
        <nav>
          <Link to="/">Home</Link> | <Link to="/order">Order</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h3>Welcome to MuTraPro!</h3>} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
