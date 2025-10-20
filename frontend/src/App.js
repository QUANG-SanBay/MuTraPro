import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/auth/api/hello")
      .then(res => setMessage(res.data))
      .catch(err => console.error(err));
  }, []);
  console.log(message)
  return (
    <div>
      <h1>MuTraPro Frontend</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
