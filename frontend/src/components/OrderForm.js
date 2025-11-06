import { useState } from "react";
import axios from "axios";

function OrderForm() {
  const [serviceType, setServiceType] = useState("Transcription");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo form data nếu có file
    const formData = new FormData();
    formData.append("serviceType", serviceType);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:4001/api/orders",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("✅ Yêu cầu đã được gửi thành công!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Gửi thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎵 Request Custom Music Service</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Service Type:</label>
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            <option>Transcription</option>
            <option>Mixing</option>
            <option>Mastering</option>
          </select>
        </div>

        <div>
          <label>Description:</label><br />
          <textarea
            rows="4"
            placeholder="Describe your request..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Upload File (audio/video):</label><br />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <button type="submit">Submit Request</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default OrderForm;
