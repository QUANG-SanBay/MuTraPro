import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routers/AppRouter"; // đúng với file của bạn
import GlobalStyles from "./assets/css/globalstyles/GlobalStyles";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

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
          <AppRouter />
        </div>
      </Router>
    </GlobalStyles>
  );
}

export default App;
