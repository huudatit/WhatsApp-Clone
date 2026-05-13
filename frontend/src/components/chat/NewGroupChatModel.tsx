import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusSquare, Users } from "lucide-react";
import { useFriendStore } from "@/store/useFriendStore";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "sonner";
import IniviteSuggestionList from "@/newGroupChat/IniviteSuggestionList";
import SelectedUsersList from "@/newGroupChat/SelectedUsersList";
import type { Friend } from "@/types/user";

const NewGroupChatModel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { friends, getFriends } = useFriendStore();
  const { createConversation } = useChatStore();

  // Tự động tải danh sách bạn bè khi mở Modal
  useEffect(() => {
    if (isOpen) {
      getFriends();
      // Xóa form cũ mỗi lần mở lại Modal
      setGroupName("");
      setInvitedUsers([]);
      setSearchTerm("");
    }
  }, [isOpen, getFriends]);

  // 1. GIẢI MÃ DATA: Rút thông tin user từ Backend ra ngoài (Chìa khóa nằm ở đây!)
  const actualFriends = friends?.map((f: any) => {
    return f.username ? f : (f.user || f.friendInfo || f);
  }) || [];

  // 2. LỌC DANH SÁCH: Tìm theo tên/username và ẩn những người đã được chọn
  const filteredFriends = actualFriends.filter((friend: any) => {
    const displayName = (friend.displayName || "").toLowerCase();
    const username = (friend.username || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const isMatch = displayName.includes(search) || username.includes(search);
    const isNotSelected = !invitedUsers.some((u) => u._id === friend._id);
    
    return isMatch && isNotSelected;
  });

  const handleSelect = (friend: any) => {
    setInvitedUsers((prev) => [...prev, friend]);
    setSearchTerm(""); // Xóa ô tìm kiếm để hiện lại list sau khi chọn
  };

  const handleRemove = (user: any) => {
    setInvitedUsers((prev) => prev.filter((u) => u._id !== user._id));
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return toast.error("Vui lòng nhập tên nhóm!");
    if (invitedUsers.length < 1) return toast.error("Chọn ít nhất 1 thành viên!");

    try {
      const participantIds = invitedUsers.map((u) => u._id);
      await createConversation("group", groupName, participantIds);
      
      toast.success("Tạo nhóm thành công!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Lỗi khi tạo nhóm!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <PlusSquare className="size-4 cursor-pointer text-blue-500 hover:text-blue-600 transition-all" />
      </DialogTrigger>
      
      <DialogContent className="glass sm:max-w-md p-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Users className="size-5 text-blue-500" /> Tạo nhóm chat mới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-3">
          <div className="space-y-2">
            <Label className="font-semibold">Tên nhóm</Label>
            <Input
              placeholder="Ví dụ: Hội Anh Em UIT..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="glass focus:border-sky-400 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Thành viên</Label>
            <Input
              placeholder="Tìm tên hoặc username bạn bè..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass mb-2"
            />
            
            {/* Hiển thị những người đã chọn */}
            <SelectedUsersList invitedUsers={invitedUsers} onRemove={handleRemove} />
            
            {/* Luôn hiển thị danh sách để dễ bấm chọn */}
            <IniviteSuggestionList 
              filteredFriends={filteredFriends} 
              onSelect={handleSelect} 
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            className="w-full bg-gradient-to-r from-sky-500 to-emerald-400 text-white font-bold border-none shadow-lg shadow-sky-500/20 hover:opacity-90 active:scale-95 transition-all"
          >
            Tạo Nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModel;