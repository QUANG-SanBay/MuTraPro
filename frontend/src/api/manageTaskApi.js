import { create } from "zustand";
import { callGateway } from "./gateway";

// export const useTaskStore = create((set) => ({
//   activeTab: "all",
//   setActiveTab: (tab) => set({ activeTab: tab }),

//   tasks: [
//     {
//       id: "TASK001",
//       title: "Mùa hè rực rỡ",
//       customer: "Lê Hoàng Nam",
//       customerInitial: "L",
//       startDate: "22/10/2025",
//       deadline: "25/10/2025",
//       progress: 75,
//       status: "doing",
//       tags: ["Thu âm", "Cao"],
//     },
//     {
//       id: "TASK002",
//       title: "Đêm Noel lạnh vắng",
//       customer: "Trần Thị Hương",
//       customerInitial: "T",
//       startDate: "21/10/2025",
//       deadline: "24/10/2025",
//       progress: 90,
//       status: "review",
//       tags: ["Phối khí", "Khẩn cấp", "Chờ review"],
//     },
//   ],

//   tabs: [
//     { id: "all", label: "Tất cả" },
//     { id: "doing", label: "Đang làm" },
//     { id: "review", label: "Chờ review" },
//     { id: "delay", label: "Trễ hạn" },
//     { id: "completed", label: "Hoàn thành" },
//   ],
// }));


export const useTaskStore = create((set, get) => ({
  activeTab: "all",
  setActiveTab: (tab) => set({ activeTab: tab }),

  tasks: [],
  loading: false,
  error: null,

  tabs: [
    { id: "all", label: "Tất cả" },
    { id: "doing", label: "Đang làm" },
    { id: "review", label: "Chờ review" },
    { id: "delay", label: "Trễ hạn" },
    { id: "completed", label: "Hoàn thành" },
  ],

  // 🔹 Hàm fetch từ API Gateway
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await callGateway({
        service: "management",
        path: "/manageTask",
        method: "GET",
      });

      // Giả sử API trả về dạng [{id, title, customer, ...}]
      set({ tasks: data, loading: false });
    } catch (err) {
      console.error("[TaskStore] fetchTasks error:", err);
      set({ error: err.message, loading: false });
    }
  },
}));