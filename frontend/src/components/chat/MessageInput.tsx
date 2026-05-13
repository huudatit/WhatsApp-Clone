import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send, X } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        // Giới hạn 2MB
        return toast.error("File quá lớn! Vui lòng chọn file dưới 2MB.");
      }
      setFile(selectedFile);
      toast.success(`Đã chọn: ${selectedFile.name}`);
    }
  };

  const sendMessage = async () => {
    console.log("--- DEBUG STEP 1: MessageInput ---");
    console.log("Text content:", value);
    console.log("File object:", file);
    if (!value.trim() && !file) {
      console.log("Aborted: Empty content and no file.");
      return;
    }
    const currValue = value;
    const currFile = file;

    setValue("");
    setFile(null);

    try {
      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(otherUser._id, currValue, currFile);
      } else {
        await sendGroupMessage(selectedConvo._id, currValue, currFile);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full bg-background border-t">
      {/* 1. Hiển thị Preview File nếu có */}
      {file && (
        <div className="px-4 py-2 bg-blue-50/50 flex items-center justify-between border-b border-blue-100">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs text-blue-600 font-medium truncate max-w-75">
              📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 h-6 w-6 rounded-full hover:bg-blue-200"
            onClick={() => setFile(null)}
          >
            <X className="size-3 text-blue-600" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 p-3 min-h-14">
        {/* 2. QUAN TRỌNG: Input ẩn để chọn file */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx"
        />

        {/* 3. QUAN TRỌNG: Button kích hoạt chọn file */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-smooth"
          onClick={() => fileInputRef.current?.click()} // Khi click vào Icon -> Kích hoạt Input ẩn
        >
          <ImagePlus
            className={cn(
              "size-4",
              file ? "text-blue-600" : "text-muted-foreground",
            )}
          />
        </Button>

        <div className="flex-1 relative">
          <Input
            onKeyPress={handleKeyPress}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Soạn tin nhắn..."
            className="pr-20 h-9 bg-white border-border/50 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-border/50 focus-visible:border-border/50 transition-smooth resize-none shadow-none"
          ></Input>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button
              // asChild
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-primary/10 transition-smooth"
            >
              <div>
                <EmojiPicker
                  onChange={(emoji: string) => setValue(`${value}${emoji}`)}
                />
              </div>
            </Button>
          </div>
        </div>

        <Button
          onClick={sendMessage}
          // Đổi sang bg-blue-600 và hiệu ứng hover tối màu hơn một chút (blue-700)
          className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-smooth hover:scale-105"
          disabled={!value.trim() && !file}
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;