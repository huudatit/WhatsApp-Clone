import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";
import { useSocketStore } from "@/stores/useSocketStore";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();

  chat = chat ?? conversations.find((c) => c._id === activeConversationId);

  if (!chat) {
    return (
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
      </header>
    );
  }

  const otherUser = chat.participants?.find((p) => p._id !== user?._id);

  const isGroup = chat.type === "group" || !!chat.group;

  const chatName = isGroup
    ? chat.group?.name
    : otherUser?.username || "Người dùng";
  

  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
{/* 
        <div className="p-2 w-full flex items-center gap-3">
          <SidebarTrigger className="md:hidden -ml-2" /> */}

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            {!isGroup ? (
              <>
                <UserAvatar
                  type={"sidebar"}
                  name={otherUser?.username || "User"}
                  avatarUrl={otherUser?.avatarUrl || undefined}
                />
                <StatusBadge
                  status={
                    onlineUsers.includes(otherUser?._id ?? "")
                      ? "online"
                      : "offline"
                  }
                />
              </>
            ) : (
              <GroupChatAvatar
                participants={chat.participants}
                type="sidebar"
              />
            )}
          </div>

          {/* name */}
          <h2 className="font-semibold text-foreground">{chatName}</h2>
        </div>
      </div>
    </header>
  );
};

export default ChatWindowHeader;
