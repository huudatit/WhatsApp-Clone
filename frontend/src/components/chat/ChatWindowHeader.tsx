import { useChatStore } from "@/store/useChatStore";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import GroupChatAvatar from "./GroupChatAvatar";
import { useSocketStore } from "@/store/useSocketStore";
import { Trash2 } from "lucide-react";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations = [], activeConversationId, removeConversation } = useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();

  let otherUser;

  chat = chat ?? conversations?.find((c) => c._id === activeConversationId);

  if (!chat) {
    return (
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
      </header>
    );
  }

  if (chat.type === "direct") {
    const otherUsers = chat?.participants?.filter((p) => p._id !== user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

    if (!user || !otherUser) return;
  }

  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="p-2 w-full flex items-center gap-3">
          {/* avatar */}
          <div className="relative">
            {chat.type === "direct" ? (
              <>
                <UserAvatar
                  type={"sidebar"}
                  name={otherUser?.displayName || "Moji"}
                  avatarUrl={otherUser?.avatarUrl || undefined}
                />
                {/* todo: socket io */}
              </>
            ) : (
              <GroupChatAvatar
                participants={chat.participants}
                type="sidebar"
              />
            )}
          </div>

          {/* name */}
          <h2 className="font-semibold text-foreground">
            {chat.type === "direct" ? otherUser?.displayName : chat.group?.name}
          </h2>
        </div>
      </div>
      {/* NÚT XÓA */}
      <div className="flex items-center" title="Xóa cuộc trò chuyện">
        <Trash2 
          className="size-5 text-slate-400 hover:text-red-500 cursor-pointer transition-colors" 
          onClick={() => {
            if (window.confirm("Bạn có chắc chắn muốn xóa đoạn chat này không?")) {
              removeConversation(chat._id);
            }
          }}
          // Xóa dòng title ở đây đi là hết lỗi đỏ
        />
      </div>
    </header>
  );
};

export default ChatWindowHeader;
