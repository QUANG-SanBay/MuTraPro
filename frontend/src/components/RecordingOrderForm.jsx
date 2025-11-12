import React, { useState } from "react";
import { createOrder } from "../api/orderAPI";

const RecordingOrderForm = () => {
  const [form, setForm] = useState({
    serviceType: "Thu âm",
    date: "",
    time: "",
    songName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    try {
      await createOrder(formData);
      setMessage("🎉 Đặt lịch thu âm thành công!");
      setForm({ serviceType: "Thu âm", date: "", time: "", songName: "", description: "" });
    } catch (err) {
      setMessage("❌ Lỗi khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Loại dịch vụ</label>
        <input
          type="text"
          name="serviceType"
          value={form.serviceType}
          readOnly
          className="w-full border rounded-lg p-2 bg-gray-100"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm text-gray-700 mb-1">Ngày đặt lịch</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-700 mb-1">Giờ</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Tên bài hát</label>
        <input
          type="text"
          name="songName"
          placeholder="Nhập tên bài hát"
          value={form.songName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Mô tả yêu cầu</label>
        <textarea
          name="description"
          placeholder="Mô tả chi tiết về yêu cầu của bạn..."
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800"
      >
        {loading ? "Đang gửi..." : "🎙️ Đặt lịch thu âm"}
      </button>

      {message && <p className="text-center text-sm text-gray-600 mt-2">{message}</p>}
    </form>
  );
};

export default RecordingOrderForm;
