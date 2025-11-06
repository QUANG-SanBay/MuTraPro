import { useState } from "react";
import axios from "axios";

function OrderPage() {
  const [form, setForm] = useState({
    customerID: "",
    specialistID: "",
    fileID: "",
    loaiDinhVu: "TRANSCRIPTION",
    tongTien: "",
    chiTiet: "",
    trangThai: "PENDING",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4001/orders", form);
      setMessage("✅ Order created successfully! ID: " + res.data.orderID);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create order.");
    }
  };

  return (
    <div style={{ margin: "50px auto", width: "600px" }}>
      <h2>📝 Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <label>Customer ID:</label>
        <input
          type="text"
          name="customerID"
          value={form.customerID}
          onChange={handleChange}
          required
        />
        <br />

        <label>Specialist ID:</label>
        <input
          type="text"
          name="specialistID"
          value={form.specialistID}
          onChange={handleChange}
        />
        <br />

        <label>File ID:</label>
        <input
          type="text"
          name="fileID"
          value={form.fileID}
          onChange={handleChange}
        />
        <br />

        <label>Service Type:</label>
        <select
          name="loaiDinhVu"
          value={form.loaiDinhVu}
          onChange={handleChange}
        >
          <option value="TRANSCRIPTION">Transcription</option>
          <option value="ARRANGEMENT">Arrangement</option>
          <option value="RECORDING">Recording</option>
        </select>
        <br />

        <label>Details:</label>
        <textarea
          name="chiTiet"
          value={form.chiTiet}
          onChange={handleChange}
          placeholder="Enter service details..."
          rows="4"
        />
        <br />

        <label>Total Price:</label>
        <input
          type="number"
          name="tongTien"
          value={form.tongTien}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Submit Order</button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}

export default OrderPage;
