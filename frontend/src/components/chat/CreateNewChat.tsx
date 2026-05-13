import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import FriendListModal from "@/createNewChat/FriendListModal";
import { MessageSquarePlus } from "lucide-react";

const CreateNewChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Đã thay bg-blue-500 thành dải màu Gradient tuyệt đẹp */}
      <div 
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400  text-white py-3 rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-md"
      >
        <MessageSquarePlus size={25} />
        <span>Tạo Đoạn Chat Mới</span>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <FriendListModal />
      </Dialog>
    </>
  );
};

export default CreateNewChat;