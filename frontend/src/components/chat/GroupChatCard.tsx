import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useChatStore } from "@/stores/useChatStore";
import ChatCard from "./ChatCard";
import GroupChatAvatar from "./GroupChatAvatar";
import UnreadCountBadge from "./UnreadCountBadge";
import { cn } from "@/lib/utils";

export const GroupChatCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
    deleteConversation, 
    // leaveGroup,
  } = useChatStore();

  if (!user) return null;

  const unreadCount = convo.unreadCounts?.[user._id] || 0;
  const name = convo.group?.name || "Nhóm không tên";

  const lastMessageObj = convo.lastMessage;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const senderData = (lastMessageObj as any)?.senderId;
  const senderId =
    typeof senderData === "string" ? senderData : senderData?._id;
  const isMe = senderId === user._id;

  let lastMessageDisplay = "Bắt đầu cuộc trò chuyện";
  if (lastMessageObj) {
    const senderName = isMe ? "Bạn" : senderData?.username || "Thành viên";
    lastMessageDisplay = `${senderName}: ${lastMessageObj.content}`;
  }

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages(id);
    }
  };

  const handleDeleteConversation = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa lịch sử cuộc trò chuyện này?")
    ) {
      deleteConversation(convo._id);
    }
  };

  // const handleLeaveGroup = () => {
  //   if (window.confirm("Bạn có chắc chắn muốn rời khỏi nhóm này?")) {
  //     leaveGroup(convo._id);
  //     console.log("Rời nhóm:", convo._id);
  //   }
  // };

  const uniqueParticipants =
    convo.participants?.filter(
      (v, i, a) => a.findIndex((t) => t._id === v._id) === i,
    ) || [];

  return (
    <ChatCard
      convoId={convo._id}
      name={name}
      timestamp={
        convo.lastMessage?.createdAt
          ? new Date(convo.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      onDelete={handleDeleteConversation}
      leftSection={
        <>
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          <GroupChatAvatar participants={uniqueParticipants} type="chat" />
        </>
      }
      subtitle={
        /* Sử dụng Fragment <> </> để bao bọc nhiều thẻ p */
        <>
          <p className="text-xs truncate text-muted-foreground/80">
            {uniqueParticipants.length} thành viên
          </p>
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
        </>
      }
    />
  );
};;
