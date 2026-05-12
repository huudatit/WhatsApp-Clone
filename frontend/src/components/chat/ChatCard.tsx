import React from "react";
import { Card } from "../ui/card";
import { cn, formatOnlineTime } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface ChatCardProps {
  convoId: string;
  name: string;
  timestamp?: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCount?: number;
  leftSection: React.ReactNode; // avatar
  subtitle: React.ReactNode; // tin nhắn preview
}

const ChatCard = ({
  convoId,
  name,
  timestamp,
  isActive,
  onSelect,
  unreadCount,
  leftSection,
  subtitle,
}: ChatCardProps) => {
  return (
    <Card
      key={convoId}
      className={cn(
        "border-none p-3 cursor-pointer transition-all duration-200 bg-white/60 hover:bg-blue-50/60 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60",
        isActive &&
          "bg-blue-100/70 dark:bg-blue-900/30 ring-1 ring-blue-400/40 shadow-sm",
      )}
      onClick={() => onSelect(convoId)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">{leftSection}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={cn(
                "text-sm truncate",
                unreadCount && unreadCount > 0 && "text-foreground",
              )}
            >
              {name}
            </h3>

            <span className="text-xs text-muted-foreground">
              {timestamp ? formatOnlineTime(timestamp) : ""}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
              {subtitle}
            </div>
            <MoreHorizontal className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:size-5 transition-smooth" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
