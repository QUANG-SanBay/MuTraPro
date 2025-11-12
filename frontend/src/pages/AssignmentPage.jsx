// src/pages/AssignmentPage.jsx

import React, { useState } from 'react';
// Đảm bảo đường dẫn này đúng:
import AssignmentModal from './AssignmentModal';

// Dữ liệu giả lập mô phỏng các nhiệm vụ
const mockTasks = [
  { id: 'ASG001', name: 'Mùa hè rực rỡ', status: 'Chờ phân công', tags: ['Thu âm', 'Cao'], deadline: '25/10/2025', reqCode: 'REQ001' },
  { id: 'ASG002', name: 'Đêm noel bình yên', status: 'Chờ phân công', tags: ['Phối khí', 'Khẩn cấp'], deadline: '24/10/2025', reqCode: 'REQ002' },
  { id: 'ASG003', name: 'Tết đoàn viên', status: 'Đang thực hiện', tags: ['Mixing', 'Trung bình'], deadline: '26/10/2025', reqCode: 'REQ003' },
];

const tabs = [
  { key: 'pending', label: 'Chờ phân công (3)', status: 'Chờ phân công' },
  { key: 'assigned', label: 'Đã phân công (1)', status: 'Đã phân công' },
  { key: 'in_progress', label: 'Đang thực hiện (1)', status: 'Đang thực hiện' },
  { key: 'all', label: 'Tất cả (5)', status: 'Tất cả' },
];

const getTagStyleAssignment = (tag) => {
  switch (tag) {
    case 'Thu âm': case 'Phối khí': return 'bg-green-100 text-green-800'; 
    case 'Cao': return 'bg-red-100 text-red-800';
    case 'Khẩn cấp': return 'bg-pink-100 text-pink-800';
    case 'Chờ phân công': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const TaskCard = ({ task, onAssign }) => (
  <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center">
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        {task.name}
      </h3>
      <div className="flex items-center space-x-2 mb-2">
        {task.tags.map(tag => (
          <span
            key={tag}
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTagStyleAssignment(tag)}`}
          >
            {tag}
          </span>
        ))}
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTagStyleAssignment(task.status)}`}>
          {task.status}
        </span>
      </div>
      <p className="text-sm text-gray-500">
        Mã: **{task.id}** • Mã yêu cầu: **{task.reqCode}**
      </p>
      <p className="text-sm text-gray-500 flex items-center mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Hạn chót: **{task.deadline}**
      </p>
    </div>
    <button 
      onClick={onAssign}
      className="flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
    >
      <span>Phân công</span>
    </button>
  </div>
);

const AssignmentPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAssignClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const filteredTasks = mockTasks.filter(task => {
    if (activeTab === 'all') return true;
    const currentTabStatus = tabs.find(t => t.key === activeTab).status;
    return task.status === currentTabStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800">
          Phân công nhiệm vụ
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Giao nhiệm vụ cho các chuyên gia phù hợp
        </p>

        {/* Tabs */}
        <div className="flex space-x-0 bg-gray-100 p-1 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 py-2 text-sm transition-all duration-300 font-semibold rounded-lg
                ${activeTab === tab.key 
                  ? 'bg-white text-indigo-700 shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onAssign={() => handleAssignClick(task)} 
            />
          ))}
        </div>
      </div>

      {/* Assignment Modal (Giả định bạn đã đặt component này vào src/components) */}
      {isModalOpen && selectedTask && (
        <AssignmentModal 
          task={selectedTask} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
};

export default AssignmentPage;