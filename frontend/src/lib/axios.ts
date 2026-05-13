import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const storageData = localStorage.getItem("auth-storage");

  if (storageData) {
    try {
      const { state } = JSON.parse(storageData);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch (error) {
      console.error("Lỗi khi đọc token từ storage:", error);
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Bỏ qua các endpoint liên quan đến Auth để tránh vòng lặp vô tận
    if (
      originalRequest.url.includes("/auth/send-otp") ||
      originalRequest.url.includes("/auth/verify-otp") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest._retryCount < 1
    ) {
      originalRequest._retryCount += 1;

      try {
        console.log("Token lỗi hoặc hết hạn. Đang tiến hành lấy token mới...");

        const res = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.data.accessToken;

        const { useAuthStore } = await import("@/stores/useAuthStore");
        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Refresh Token hết hạn hoặc không hợp lệ. Yêu cầu đăng nhập lại.",
        );
        const { useAuthStore } = await import("@/stores/useAuthStore");
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
