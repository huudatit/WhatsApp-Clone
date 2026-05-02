import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { useEffect } from "react";
import ChatAppPage from "./pages/ChatAppPage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  useEffect(() => {
    // 1. Tự động "đăng nhập" bằng cách nhét fake user vào store
    setUser({
      _id: "user_me",
      username: "ngocan",
      email: "an@example.com",
      displayName: "Trần Vũ Ngọc An",
      avatarUrl: "https://i.pravatar.cc/150?u=me",
    });

    // 2. Kích hoạt lấy danh sách hội thoại ảo luôn
    fetchConversations();
  }, [setUser, fetchConversations]);

  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          {/* default → chat */}
          <Route path="/" element={<Navigate to="/chat" />} />

          {/* chat */}
          <Route path="/chat" element={<ChatAppPage />} />

          {/* login vẫn giữ nếu cần test */}
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;