// Simple client cho Notification qua Gateway
import axios from "axios";
import API_BASE from "./gateway"; // đã có sẵn file này trong dự án của bạn

const http = axios.create({
  baseURL: API_BASE, // ví dụ: http://localhost:8000/api
  timeout: 15000,
});

http.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("Notification API error:", e?.response?.data || e.message);
    return Promise.reject(e);
  }
);

export const listNotifications = async () => {
  const { data } = await http.get("/notifications");
  return data;
};

export const createNotification = async (payload) => {
  const { data } = await http.post("/notifications", payload);
  return data;
};
