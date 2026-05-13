import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useChatStore } from "@/stores/useChatStore";
import ChatCard from "./ChatCard";
import GroupChatAvatar from "./GroupChatAvatar";
import UnreadCountBadge from "./UnreadCountBadge";

export const GroupChatCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();

  if (!user) return null;

  const unreadCount = convo.unreadCounts?.[user._id] || 0;
  const name = convo.group?.name || "Nhóm không tên";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages(id);
    }
  };

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
      leftSection={
        <>
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          <GroupChatAvatar participants={uniqueParticipants} type="chat" />
        </>
      }
      subtitle={
        <p className="text-sm truncate text-muted-foreground">
          {uniqueParticipants.length} thành viên
        </p>
      }
    />
  );
};
