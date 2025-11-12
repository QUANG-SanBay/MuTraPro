import React, { useState } from "react";
import { Upload } from "lucide-react";

const UploadOrderForm = () => {
  const [form, setForm] = useState({
    serviceType: "Gửi bản nhạc có sẵn",
    songName: "",
    note: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      // Gọi đúng endpoint BE nhận FormData
      const response = await fetch("http://localhost:4001/orders/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create order");

      const data = await response.json(); // dữ liệu trả về từ BE
      console.log("Created order:", data);

      setMessage("🎵 Gửi yêu cầu thành công!");
      setForm({ serviceType: "Gửi bản nhạc có sẵn", songName: "", note: "", file: null });
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Gửi yêu cầu bản nhạc</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loại dịch vụ */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Loại dịch vụ</label>
            <input
              type="text"
              value={form.serviceType}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-700"
            />
          </div>

          {/* Tên bài hát */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Tên bài hát</label>
            <input
              type="text"
              name="songName"
              placeholder="Nhập tên bài hát"
              value={form.songName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Upload file */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-600 text-sm">Upload bản nhạc/ký âm</p>
            <p className="text-gray-400 text-xs mb-3">Hỗ trợ: MP3, WAV, FLAC, AIFF</p>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
            />
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Ghi chú</label>
            <textarea
              name="note"
              placeholder="Thêm ghi chú về yêu cầu xử lý (nếu có)"
              value={form.note}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            {loading ? "Đang gửi..." : "📩 Gửi yêu cầu"}
          </button>

          {/* Message */}
          {message && <p className="text-center text-sm text-gray-600 mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UploadOrderForm;
