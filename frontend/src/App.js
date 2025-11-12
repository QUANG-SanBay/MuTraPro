import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routers/AppRouter";
import GlobalStyles from "./assets/css/globalstyles/GlobalStyles";
import { useState, useEffect } from "react";
import axios from "axios";

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
      <BrowserRouter>
        <div style={{ padding: "10px" }}>
          <p>Backend says: {message}</p>
        </div>
        <AppRouter />
      </BrowserRouter>
    </GlobalStyles>
  );
}

export default App;
