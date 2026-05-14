import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000; // 5 phút

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  return (
    <>
      <div
        className={cn(
          "flex gap-2 message-bounce mt-1",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {/* avatar */}
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.username ?? "Friend"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* tin nhắn */}
        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          <Card
            className={cn(
              // Nếu chỉ có ảnh thì giảm bớt padding để ảnh trông to và đẹp hơn
              message.imgUrl && !message.content ? "p-1" : "p-3",
              message.isOwn
                ? "bg-linear-to-br from-blue-500 to-blue-700 text-white border-0 rounded-2xl rounded-br-sm shadow-md"
                : "chat-bubble-received",
            )}
          >
            {/* HIỂN THỊ HÌNH ẢNH NẾU CÓ */}
            {message.imgUrl && (
              <div
                className={cn(
                  "overflow-hidden rounded-xl",
                  message.content ? "mb-2" : "", // Tạo khoảng cách nếu có chữ bên dưới
                )}
              >
                <img
                  src={message.imgUrl}
                  alt="Attachment"
                  className="max-w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity min-w-[150px] min-h-[100px]"
                  loading="lazy"
                  onClick={() => window.open(message.imgUrl!, "_blank")}
                />
              </div>
            )}

            {/* HIỂN THỊ VĂN BẢN NẾU CÓ */}
            {message.content && (
              <p className="text-sm leading-relaxed wrap-break-word px-1">
                {message.content}
              </p>
            )}
          </Card>

          {/* seen/ delivered */}
          {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
            <div className="flex flex-col items-end gap-1 mt-1">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4 border-0",
                  lastMessageStatus === "seen"
                    ? "bg-blue-500 text-white"
                    : "bg-muted/50 text-muted-foreground",
                )}
              >
                {lastMessageStatus === "seen" ? "Đã xem" : "Đã gửi"}
              </Badge>

              {/* HIỂN THỊ THỜI GIAN SEEN NẾU CÓ */}
              {lastMessageStatus === "seen" && selectedConvo.lastMessageAt && (
                <span className="text-[10px] text-muted-foreground pr-1">
                  {formatMessageTime(new Date(selectedConvo.lastMessageAt))}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {isShowTime && (
        <div className="flex justify-center my-4">
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        </div>
      )}
    </>
  );
};

export default MessageItem;
