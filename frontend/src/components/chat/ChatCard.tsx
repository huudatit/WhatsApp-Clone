import React from "react";
import { Card } from "../ui/card";
import { cn, formatOnlineTime } from "@/lib/utils";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface ChatCardProps {
  convoId: string;
  name: string;
  timestamp?: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCount?: number;
  leftSection: React.ReactNode;
  subtitle: React.ReactNode;
  onDelete?: () => void;
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
  onDelete
}: ChatCardProps) => {
  return (
    <Card
      key={convoId}
      className={cn(
        "group border-none p-3 cursor-pointer transition-all duration-200 bg-white/60 hover:bg-blue-50/60 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60",
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
                unreadCount && unreadCount > 0 && "text-foreground font-medium",
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button
                  // QUAN TRỌNG: Ngăn chặn click lan ra ngoài Card
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none shrink-0"
                >
                  <MoreHorizontal className="size-4 text-muted-foreground hover:text-foreground transition-smooth" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 z-50">
                <DropdownMenuItem
                  onClick={(e) => {
                    // Ngăn chặn khi click vào menu item vẫn bị lan ra ngoài
                    e.stopPropagation();
                    console.log(
                      "[DEBUG 1 - ChatCard] Đã click vào nút Xóa trong Menu",
                    );

                    if (onDelete) {
                      console.log(
                        "[DEBUG 1 - ChatCard] Prop onDelete tồn tại, đang gọi hàm...",
                      );
                      onDelete();
                    } else {
                      console.warn(
                        "[DEBUG 1 - ChatCard] CẢNH BÁO: Prop onDelete bị UNDEFINED (Chưa truyền từ component cha xuống)",
                      );
                    }
                  }}
                  className="text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="size-4" />
                  <span>Xóa cuộc trò chuyện</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
