import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriendStore } from "@/store/useFriendStore";
import { Users } from "lucide-react";
import SentRequests from "./SentRequests";
import ReceivedRequests from "./ReceivedRequests";

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const [tab, setTab] = useState("received");
  const { getAllFriendRequests } = useFriendStore();

  useEffect(() => {
    if (open) {
      getAllFriendRequests();
    }
  }, [open, getAllFriendRequests]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass sm:max-w-md p-4 gap-4">
        <DialogHeader className="p-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Users className="size-5 text-blue-500" /> 
            Lời mời kết bạn
          </DialogTitle>
        </DialogHeader>

        {/* Ép flex dọc để các thành phần nằm đúng hàng */}
        <Tabs value={tab} onValueChange={setTab} className="w-full flex flex-col gap-4">
          
          {/* Cố định chiều cao h-11 để Tab không bị phình to thành hình tròn */}
          <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50 rounded-lg p-1">
            <TabsTrigger value="received" className="rounded-md">Đã nhận</TabsTrigger>
            <TabsTrigger value="sent" className="rounded-md">Đã gửi</TabsTrigger>
          </TabsList>

          {/* Vùng chứa nội dung danh sách, có thanh cuộn nếu quá nhiều */}
          <div className="min-h-[250px] max-h-[350px] overflow-y-auto pr-1">
            <TabsContent value="received" className="m-0 focus-visible:outline-none">
              <ReceivedRequests />
            </TabsContent>
            
            <TabsContent value="sent" className="m-0 focus-visible:outline-none">
              <SentRequests />
            </TabsContent>
          </div>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;