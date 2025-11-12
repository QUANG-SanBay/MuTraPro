// RequestIntakePage.jsx
import React, { useState } from 'react';
import DetailModal from '../../../components/orders/DetailModal';

const mockRequests = [
  { id: 'REQ001', name: 'Mùa hè rực rỡ', user: 'Nguyễn Văn A', email: 'nguyenvana@email.com', date: '23/10/2025', status: 'Mới', tags: ['Thu âm', 'Cao', 'Mới'] },
  { id: 'REQ002', name: 'Đêm noel bình yên', user: 'Trần Thị B', email: 'tranthib@email.com', date: '23/10/2025', status: 'Mới', tags: ['Phối khí', 'Khẩn cấp', 'Mới'] },
  { id: 'REQ003', name: 'Tình ca xưa', user: 'Lê Văn C', email: 'levanc@email.com', date: '22/10/2025', status: 'Đã phân loại', tags: ['Kỹ âm', 'Trung bình', 'Đã phân loại'] },
  { id: 'REQ004', name: 'Rock ballad', user: 'Phạm Thị D', email: 'phamthid@email.com', date: '22/10/2025', status: 'Đã phân loại', tags: ['Mix nhạc', 'Cao', 'Đã phân loại'] },
  { id: 'REQ005', name: 'EDM Energy', user: 'Hoàng Văn E', email: 'hoangvane@email.com', date: '21/10/2025', status: 'Đã phân công', tags: ['Mastering', 'Thấp', 'Đã phân công'] },
];

const tabs = [
  { key: 'new', label: 'Mới (2)', status: 'Mới' },
  { key: 'classified', label: 'Đã phân loại (2)', status: 'Đã phân loại' },
  { key: 'assigned', label: 'Đã phân công (1)', status: 'Đã phân công' },
  { key: 'all', label: 'Tất cả (5)', status: 'Tất cả' },
];

const getTagStyle = (tag) => {
  switch (tag) {
    case 'Thu âm': case 'Kỹ âm': return 'bg-green-100 text-green-800 font-semibold text-sm';
    case 'Phối khí': case 'Mix nhạc': case 'Mastering': return 'bg-purple-100 text-purple-800 font-semibold text-sm';
    case 'Cao': case 'Khẩn cấp': return 'bg-red-100 text-red-800 font-semibold text-sm';
    case 'Trung bình': return 'bg-yellow-100 text-yellow-800 font-semibold text-sm';
    case 'Thấp': return 'bg-gray-100 text-gray-800 font-semibold text-sm';
    case 'Mới': return 'bg-blue-100 text-blue-800 font-semibold text-sm';
    case 'Đã phân loại': return 'bg-orange-100 text-orange-800 font-semibold text-sm';
    case 'Đã phân công': return 'bg-teal-100 text-teal-800 font-semibold text-sm';
    default: return 'bg-gray-100 text-gray-800 font-semibold text-sm';
  }
};

const RequestIntakePage = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleOpenDetail = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const filteredRequests = mockRequests.filter(req => {
    if (activeTab === 'all') return true;
    const currentTabStatus = tabs.find(t => t.key === activeTab).status;
    return req.status === currentTabStatus;
  });

  return (
    <div className="bg-gray-50 min-h-screen px-10 py-8">
      <div className="max-w-7xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800">
              Tiếp nhận và phân loại yêu cầu
            </h2>
            <p className="text-lg text-gray-500 mt-2">
              Quản lý các yêu cầu dịch vụ từ khách hàng
            </p>
          </div>
          <button className="flex items-center text-gray-500 hover:text-gray-700 px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Lọc
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl overflow-hidden mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 py-3 text-lg font-semibold transition-all duration-300
                ${activeTab === tab.key
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'text-gray-700 hover:text-gray-900'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Request Cards */}
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {req.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {req.tags.map(tag => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full ${getTagStyle(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-lg text-gray-700">{req.user} • {req.email}</p>
                <p className="text-lg text-gray-700 mt-1">
                  Mã: {req.id} • Ngày: {req.date}
                </p>
              </div>

              {/* Nút Chi tiết có màu tím (indigo) */}
              <button
                onClick={() => handleOpenDetail(req)}
                className="flex items-center gap-2 px-5 py-2.5 text-lg font-medium rounded-lg 
                text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Chi tiết
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal chi tiết */}
      {isModalOpen && selectedRequest && (
        <DetailModal request={selectedRequest} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default RequestIntakePage;
