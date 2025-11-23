import React, { useState } from "react";

const RecordingOrderForm = () => {
  const [form, setForm] = useState({
    serviceType: "Thu âm",
    date: "",
    time: "",
    songName: "",
    description: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("customerName", form.songName);
      formData.append("email", ""); // nếu cần có email
      formData.append("phone", ""); // nếu cần có phone
      formData.append("tags", form.description);
      if (form.file) {
        formData.append("file", form.file);
      }

      const response = await fetch("http://localhost:4001/orders/upload", {
        method: "POST",
        body: formData, // browser tự set Content-Type
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create order");
      }

      const data = await response.json();
      console.log("Created order:", data);

      setMessage("🎉 Đặt lịch thu âm thành công!");
      setForm({
        serviceType: "Thu âm",
        date: "",
        time: "",
        songName: "",
        description: "",
        file: null,
      });

    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Đặt lịch thu âm</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại dịch vụ</label>
          <input
            type="text"
            name="serviceType"
            value={form.serviceType}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-700"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đặt lịch</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài hát</label>
          <input
            type="text"
            name="songName"
            placeholder="Nhập tên bài hát"
            value={form.songName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả yêu cầu</label>
          <textarea
            name="description"
            placeholder="Mô tả chi tiết về yêu cầu..."
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File đính kèm</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {loading ? "Đang gửi..." : "🎙️ Đặt lịch thu âm"}
        </button>

        {message && <p className="text-center text-sm text-gray-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default RecordingOrderForm;
