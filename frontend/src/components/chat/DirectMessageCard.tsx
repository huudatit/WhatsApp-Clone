import type { Conversation } from '@/types/chat'
import { useChatStore } from '@/store/useChatStore';
import ChatCard from './ChatCard';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';

const DirectMessageCard = ({ convo }: { convo : Conversation }) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();

    if(!user) return null;

    const otherUser = convo.participants.find(
      (p) => String(p._id) !== String(user._id)
    );
    if(!otherUser) return;

    const lastMessage = convo.lastMessage?.content ?? "";

    const handleSelectConversation = async (id:string) => {
        setActiveConversation(id);
        if(!messages[id]) {
          await fetchMessages(id);
        }
    }

  return (
  <ChatCard
    convoId={convo._id}
    name={otherUser.displayName ?? ""}
    isActive={activeConversationId === convo._id}
    onSelect={handleSelectConversation}
    leftSection={
      <UserAvatar
        type="sidebar"
        name={otherUser.displayName ?? ""}
        avatarUrl={otherUser.avatarUrl ?? undefined}
      />
    }
    subtitle={
      <p
        className={cn(
          "text-sm truncate text-muted-foreground"
        )}
      >
        {lastMessage}
      </p>
    }
  />
);

}

export default DirectMessageCard