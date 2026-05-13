import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { useEffect } from "react";
import ChatAppPage from "./pages/ChatAppPage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/useAuthStore";
import { useSocketStore } from "./store/useSocketStore";
import { useChatStore } from "./store/useChatStore";

// Component bảo vệ Route Chat
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isCheckingAuth } = useAuthStore(); 

  if (isCheckingAuth) {
    return <div className="h-screen w-screen flex items-center justify-center">Đang kiểm tra đăng nhập...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

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