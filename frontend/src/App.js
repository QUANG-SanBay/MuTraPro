import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// IMPORT CÁC COMPONENTS ĐÃ CÓ
import MediaTracking from "./pages/MediaTracking";

// IMPORT COMPONENT MỚI THÊM VÀO
import TaskDetail from "./pages/TaskDetail";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/auth/api/hello")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>MuTraPro Frontend</h1>
      <p>Backend says: {message}</p>
      </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px", padding: "10px", background: "#f2f2f2" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/theodoidonhang" style={{ marginRight: "10px" }}>Theo dõi đơn hàng</Link>
        <Link to="/chitietcongviec">Chi tiết công việc</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/theodoidonhang" element={<MediaTracking />} />
        <Route path="/chitietcongviec" element={<TaskDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;