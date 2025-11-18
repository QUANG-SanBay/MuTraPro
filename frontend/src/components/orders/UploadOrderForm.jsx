import React, { useState } from "react";
import { Upload } from "lucide-react";

const UploadOrderForm = () => {
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    tags: "",
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
      formData.append("customerName", form.customerName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("tags", form.tags);
      if (form.file) formData.append("file", form.file);

      const response = await fetch("http://localhost:4001/orders/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to create order");
      }

      const data = await response.json();
      console.log("Created order:", data);

      setMessage("🎵 Gửi yêu cầu thành công!");
      setForm({ customerName: "", email: "", phone: "", tags: "", file: null });
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi gửi yêu cầu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-purple-50 to-orange-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Gửi yêu cầu bản nhạc</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/** Customer Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm transition"
              required
            />
          </div>

          {/** Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm transition"
              required
            />
          </div>

          {/** Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm transition"
              required
            />
          </div>

          {/** Tags */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Ví dụ: Thu âm, Cao, Mới"
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm transition"
            />
          </div>

          {/** File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition">
            <Upload className="mx-auto mb-2 text-gray-400" size={36} />
            <p className="text-gray-600 text-sm mb-2">Upload bản nhạc (tùy chọn)</p>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full text-sm"
            />
          </div>

          {/** Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            {loading ? "Đang gửi..." : "📩 Gửi yêu cầu"}
          </button>

          {message && (
            <p className="text-center text-sm mt-2 font-medium text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadOrderForm;
