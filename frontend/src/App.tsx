import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { useEffect } from "react";
import ChatAppPage from "./pages/ChatAppPage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/useAuthStore";

// Component bảo vệ Route Chat
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  // Nếu chưa có user -> đẩy về trang login
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { user, fetchMe } = useAuthStore();

  // Khi tải trang, tự động check xem đã đăng nhập chưa (dựa vào cookie/token backend)
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          {/* Mặc định: Có user thì vào chat, chưa có thì ra login */}
          <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} replace />} />

          {/* Trang Login: Nếu đã login rồi thì tự đẩy về chat */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/chat" replace /> : <AuthPage />} 
          />

          {/* Trang Chat: Được bảo vệ bởi PrivateRoute */}
          <Route 
            path="/chat" 
            element={
              <PrivateRoute>
                <ChatAppPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;