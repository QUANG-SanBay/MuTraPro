import React, { useState } from "react";
import AssignmentModal from "./AssignmentModal";

// ================== DỮ LIỆU GIẢ LẬP ==================
const initialTasks = [
  { id: "ASG001", name: "Mùa hè rực rỡ", status: "Chờ phân công", tags: ["Thu âm", "Cao"], deadline: "25/10/2025", reqCode: "REQ001" },
  { id: "ASG002", name: "Đêm noel bình yên", status: "Chờ phân công", tags: ["Phối khí", "Khẩn cấp"], deadline: "24/10/2025", reqCode: "REQ002" },
  { id: "ASG003", name: "Tết đoàn viên", status: "Đang thực hiện", tags: ["Mixing", "Trung bình"], deadline: "26/10/2025", reqCode: "REQ003" },
  { id: "ASG004", name: "Hạ cuối cùng", status: "Đã phân công", tags: ["Mastering", "Cao"], deadline: "27/10/2025", reqCode: "REQ004" },
];

const tabs = [
  { key: "pending", label: "Chờ phân công", status: "Chờ phân công" },
  { key: "assigned", label: "Đã phân công", status: "Đã phân công" },
  { key: "in_progress", label: "Đang thực hiện", status: "Đang thực hiện" },
  { key: "all", label: "Tất cả", status: "Tất cả" },
];

// ================== DANH SÁCH CHUYÊN GIA ==================
const experts = [
  { id: "1", name: "Nguyễn Văn A" },
  { id: "2", name: "Trần Thị B" },
  { id: "3", name: "Lê Thị C" },
];

// ================== STYLE TAG ==================
const getTagStyleAssignment = (tag) => {
  switch (tag) {
    case "Thu âm":
    case "Phối khí":
      return "bg-green-100 text-green-800";
    case "Cao":
      return "bg-red-100 text-red-800";
    case "Khẩn cấp":
      return "bg-pink-100 text-pink-800";
    case "Chờ phân công":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// ================== TASK CARD ==================
const TaskCard = ({ task, onAssign }) => (
  <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition-all">
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{task.name}</h3>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTagStyleAssignment(tag)}`}
          >
            {tag}
          </span>
        ))}
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTagStyleAssignment(task.status)}`}
        >
          {task.status}
        </span>
      </div>
      <p className="text-sm text-gray-500">
        Mã: <strong>{task.id}</strong> • Mã yêu cầu: <strong>{task.reqCode}</strong>
      </p>
      <p className="text-sm text-gray-500 flex items-center mt-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        Hạn chót: <strong>{task.deadline}</strong>
      </p>
    </div>
    {task.status === "Chờ phân công" && (
      <button
        onClick={onAssign}
        className="flex items-center space-x-1 px-5 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
      >
        <span>Phân công</span>
      </button>
    )}
  </div>
);

// ================== MAIN PAGE ==================
const AssignmentPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("pending");
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

  const handleAssign = ({ taskId, expertId, note }) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "Đã phân công" } : t
      )
    );
    alert("Phân công thành công!");
    handleModalClose();
    console.log("Dữ liệu phân công:", { taskId, expertId, note });
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    const currentTabStatus = tabs.find((t) => t.key === activeTab).status;
    return task.status === currentTabStatus;
  });

  return (
    <div className="bg-gray-50 min-h-screen px-12 py-10">
      <div className="w-full max-w-7xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Phân công nhiệm vụ</h2>
        <p className="text-sm text-gray-500 mb-6">
          Giao nhiệm vụ cho các chuyên gia phù hợp
        </p>

        {/* Tabs */}
        <div className="flex space-x-0 bg-gray-100 p-1 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-sm transition-all duration-300 font-semibold rounded-lg ${
                activeTab === tab.key
                  ? "bg-white text-indigo-700 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onAssign={() => handleAssignClick(task)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTask && (
        <AssignmentModal
          task={selectedTask}
          experts={experts}
          onClose={handleModalClose}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default AssignmentPage;
