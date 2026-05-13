/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Conversation } from "@/types/chat";
import { useChatStore } from "@/stores/useChatStore";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import { useSocketStore } from "@/stores/useSocketStore";
import UnreadCountBadge from "./UnreadCountBadge";
import StatusBadge from "./StatusBadge";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
    deleteConversation,
  } = useChatStore();
  const { onlineUsers } = useSocketStore();

  if (!user) return null;

  const otherUser = convo.participants.find((p) => p._id !== user._id);
  if (!otherUser) return null;

  const unreadCount = convo.unreadCounts[user._id];

  const lastMessageObj = convo.lastMessage;
  const senderId =
    typeof (lastMessageObj as any)?.senderId === "string"
      ? (lastMessageObj as any).senderId
      : (lastMessageObj as any)?.senderId?._id;

  const isMe = senderId === user._id;

  const lastMessageDisplay = lastMessageObj?.content
    ? isMe
      ? `Bạn: ${lastMessageObj.content}`
      : lastMessageObj.content
    : "Bắt đầu cuộc trò chuyện";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };

  const handleDeleteConversation = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này?")) {
      deleteConversation(convo._id);
    }
  };

  return (
    <ChatCard
      convoId={convo._id}
      name={otherUser.username ?? ""}
      timestamp={
        convo.lastMessage?.createdAt
          ? new Date(convo.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar
            type="sidebar"
            name={otherUser.username ?? ""}
            avatarUrl={otherUser.avatarUrl ?? undefined}
          />
          <StatusBadge
            status={
              onlineUsers.includes(otherUser?._id ?? "") ? "online" : "offline"
            }
          />
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
        </>
      }
      subtitle={
        <p
          className={cn(
            "text-sm truncate",
            unreadCount > 0
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {lastMessageDisplay}
        </p>
      }
      onDelete={handleDeleteConversation}
    />
  );
};;

export default DirectMessageCard;
