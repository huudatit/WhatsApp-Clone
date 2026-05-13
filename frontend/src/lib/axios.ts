import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore"; // Import store chứa token

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// DẠY AXIOS TỰ ĐỘNG ĐÍNH KÈM TOKEN VÀO MỌI REQUEST
api.interceptors.request.use(
  (config) => {
    // Lấy token đang lưu trong Zustand
    const token = useAuthStore.getState().accessToken;
    
    // Nhét token vào Header với định dạng "Bearer <token>"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;