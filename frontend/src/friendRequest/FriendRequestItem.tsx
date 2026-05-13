import type { FriendRequest } from "@/types/user";
import type { ReactNode } from "react";
import UserAvatar from "@/components/chat/UserAvatar";

interface RequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: "sent" | "received";
}

const FriendRequestItem = ({ requestInfo, actions, type }: RequestItemProps) => {
  if (!requestInfo) return null;
  const info = type === "sent" ? requestInfo.to : requestInfo.from;
  if (!info) return null;

  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all">
      <div className="flex items-center gap-3">
        <UserAvatar
          type="chat" // Thu nhỏ avatar lại
          name={info.displayName || info.username || "Unknown"}
          avatarUrl={info.avatarUrl}
        />
        <div className="flex flex-col">
          <p className="text-sm font-bold leading-tight">{info.displayName || info.username}</p>
          <p className="text-[11px] text-muted-foreground">@{info.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {actions}
      </div>
    </div>
  );
};

export default FriendRequestItem;
