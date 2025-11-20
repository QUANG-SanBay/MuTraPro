import { useState } from "react";
import RecordingOrderForm from '../../../components/orders/RecordingOrderForm';
import UploadOrderForm from '../../../components/orders/UploadOrderForm';


export default function OrderPage() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Đặt hàng dịch vụ thu âm
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-5 py-2 rounded-l-lg font-medium transition-all duration-200 ${
            activeTab === "upload"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Gửi bản nhạc có sẵn
        </button>
        <button
          onClick={() => setActiveTab("record")}
          className={`px-5 py-2 rounded-r-lg font-medium transition-all duration-200 ${
            activeTab === "record"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Đặt lịch thu âm
        </button>
      </div>

      {/* Nội dung tab */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "upload" ? <UploadOrderForm /> : <RecordingOrderForm />}
      </div>
    </div>
  );
}
