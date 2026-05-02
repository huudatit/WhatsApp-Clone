import { useAuthStore } from '@/store/useAuthStore'
import type { Conversation } from '@/types/chat'
import UserAvatar from './UserAvatar'
import { useChatStore } from '@/store/useChatStore'
import ChatCard from './ChatCard'
import GroupChatAvatar from './GroupChatAvatar'

export const GroupChatCard = ({ convo } : {convo: Conversation}) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();
    
    if(!user) return null;

    const firstMember = convo.participants?.[0];
    const name = convo.group?.name ?? "";
    const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };

  return (
  <ChatCard
    convoId={convo._id}
    name={name}
    isActive={activeConversationId === convo._id}
    onSelect={handleSelectConversation}
    leftSection={
        <>
          <GroupChatAvatar
            participants={convo.participants}
            type="chat"
          />
        </>
      }
    subtitle={
      <p className="text-sm truncate text-muted-foreground">
        {convo.participants.length} thành viên
      </p>
    }
  />
);

}
