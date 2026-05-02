import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface ChatCardProps {
  convoId: string;
  name: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  leftSection: React.ReactNode; // avatar
  subtitle: React.ReactNode; // tin nhắn preview
}

const ChatCard = ({
  convoId,
  name,
  isActive,
  onSelect,
  leftSection,
  subtitle,
}: ChatCardProps) => {
  return (
    <Card
      className={cn(
        "border-none p-3 cursor-pointer transition-all duration-200 bg-white/60 hover:bg-blue-50/60 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60",
        isActive &&
          "bg-blue-100/70 dark:bg-blue-900/30 ring-1 ring-blue-400/40 shadow-sm"
      )}
      onClick={() => onSelect(convoId)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">{leftSection}</div>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-sm truncate",
              "font-medium text-zinc-800 dark:text-zinc-200"
            )}
          >
            {name}
          </h3>

          <div className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
            {subtitle}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
