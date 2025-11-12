import React from 'react';

// Đảm bảo tên component khớp với tên file
const DetailModal = ({ request, onClose }) => {
    if (!request) return null;

    // Hàm style tag đơn giản cho Modal
    const getTagStyleModal = (tag) => {
        switch (tag) {
            case 'Thu âm': case 'Phối khí': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Kỹ âm': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Mix nhạc': case 'Mastering': return 'bg-pink-100 text-pink-800 border-pink-300';
            case 'Cao': case 'Khẩn cấp': return 'bg-red-100 text-red-800 border-red-300';
            case 'Trung bình': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Thấp': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
            
            {/* Modal Content */}
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 transform transition-all scale-100" 
                onClick={e => e.stopPropagation()} 
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-3 mb-4">
                        <h3 className="text-2xl font-extrabold text-indigo-700">
                            Chi tiết Yêu cầu
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6 text-sm text-gray-700">
                        
                        {/* 1. THÔNG TIN CHUNG */}
                        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <h4 className="flex items-center text-md font-bold text-indigo-800 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                Thông tin cơ bản
                            </h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                <p><strong>Mã Yêu cầu:</strong> <span className="font-semibold text-gray-900">{request.id}</span></p>
                                <p><strong>Ngày Đặt:</strong> <span className="font-semibold">{request.date}</span></p>
                                <p className="col-span-2">
                                    <strong>Khách hàng:</strong> <span className="font-medium">{request.user}</span>
                                </p>
                                <p className="col-span-2">
                                    <strong>Email:</strong> <span className="font-medium text-indigo-600">{request.email}</span>
                                </p>
                            </div>
                        </div>

                        {/* 2. THÔNG TIN DỰ ÁN VÀ PHÂN LOẠI */}
                        <div className="border-t pt-4">
                            <h4 className="flex items-center text-md font-bold text-gray-800 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Dự án & Phân loại
                            </h4>
                            <p className="mb-2 font-semibold">Tên Dự án: <span className="text-lg text-gray-900">{request.name}</span></p>
                            
                            <div className="flex flex-wrap gap-2 pt-1">
                                {request.tags.map(tag => (
                                    <span 
                                        key={tag} 
                                        className={`px-3 py-1 text-xs font-bold rounded-full border ${getTagStyleModal(tag)}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 3. MÔ TẢ CHI TIẾT */}
                        <div className="border-t pt-4">
                            <p className="font-semibold mb-2 text-gray-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-5-5H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2h-5L8 20z" /></svg>
                                Yêu cầu chi tiết
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg border text-gray-700 italic leading-relaxed">
                                {/* Phần này giả định dữ liệu mô tả chi tiết hơn sẽ được truyền vào. 
                                    Vì mock data của bạn không có trường description, tôi dùng placeholder. */}
                                Khách hàng yêu cầu thu âm và phối khí cho một bài Rock Ballad mới với chất lượng phòng thu cao cấp. Yêu cầu nộp bản demo trước 2 ngày so với hạn chót.
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;