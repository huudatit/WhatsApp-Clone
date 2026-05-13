import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

const ChatAppPage = () => {
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex h-screen w-full p-2">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
};

export default ChatAppPage;


