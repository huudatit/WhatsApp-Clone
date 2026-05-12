/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { useEffect } from "react";
import ChatAppPage from "./pages/ChatAppPage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const { user, fetchMe } = useAuthStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  // Khi tải trang, tự động check xem đã đăng nhập chưa (dựa vào cookie/token backend)
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          {/* Mặc định: Có user thì vào chat, chưa có thì ra login */}
          <Route
            path="/"
            element={<Navigate to={user ? "/chat" : "/login"} replace />}
          />

          {/* Trang Login: Nếu đã login rồi thì tự đẩy về chat */}
          <Route
            path="/login"
            element={user ? <Navigate to="/chat" replace /> : <AuthPage />}
          />

          {/* Trang Chat: Được bảo vệ bởi PrivateRoute */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
