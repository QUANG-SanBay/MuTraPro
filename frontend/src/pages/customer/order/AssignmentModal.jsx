import React, { useState } from 'react';

const AssignmentModal = ({ task, onClose, onAssign, experts = [] }) => {
  const [selectedExpert, setSelectedExpert] = useState('');
  const [note, setNote] = useState('');

  if (!task) return null;

  const handleAssign = () => {
    if (!selectedExpert) {
      alert('Vui lòng chọn chuyên gia!');
      return;
    }

    // Gọi callback từ parent
    onAssign?.({
      taskId: task.id,
      expertId: selectedExpert,
      note,
    });

    // ⚡ Hiển thị thông báo thành công
    alert('Phân công thành công!');

    // Đóng modal
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Phân công nhiệm vụ
          </h3>

          <p className="text-gray-600 mb-6 text-sm">
            Chọn chuyên gia phù hợp cho nhiệm vụ: <strong>{task.name}</strong>
          </p>

          <div className="mb-6 space-y-2 text-sm p-3 bg-gray-50 border rounded-lg">
            <h4 className="font-bold text-gray-800">Thông tin nhiệm vụ</h4>
            <p>
              Mã nhiệm vụ: <span className="font-medium">{task.id}</span>
            </p>
            <p>
              Hạn chót:{' '}
              <span className="font-medium text-red-500">{task.deadline}</span>
            </p>
            <p className="flex items-center">
              Loại dịch vụ:
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {task.serviceType || 'Thu âm'}
              </span>
              <span className="ml-3">
                Ưu tiên:
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {task.priority || 'Cao'}
                </span>
              </span>
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="expert"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chọn chuyên gia
            </label>
            <select
              id="expert"
              value={selectedExpert}
              onChange={(e) => setSelectedExpert(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
            >
              <option value="">Chọn chuyên gia phù hợp</option>
              {experts.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ghi chú cho chuyên gia
            </label>
            <textarea
              id="note"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thêm hướng dẫn, yêu cầu đặc biệt..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleAssign}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Phân công
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
