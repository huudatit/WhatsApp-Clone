/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFriendStore } from "@/stores/useFriendStore";
import SentRequests from "./SentRequests";
import ReceivedRequests from "./ReceivedRequests";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const { getAllFriendRequests } = useFriendStore();

  useEffect(() => {
    const loadRequest = async () => {
      try {
        await getAllFriendRequests();
      } catch (error) {
        console.error("Lỗi xảy ra khi load requests", error);
      }
    };

    loadRequest();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Lời mời kết bạn</DialogTitle>
        </DialogHeader>
        {/* <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Đã nhận</TabsTrigger>
            <TabsTrigger value="sent">Đã gửi</TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <ReceivedRequests />
          </TabsContent>

          <TabsContent value="sent">
            <SentRequests />
          </TabsContent>
        </Tabs> */}
        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-6">
            {/* Phần 1: Lời mời đã nhận */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider">
                  Lời mời đã nhận
                </h3>
              </div>
              <ReceivedRequests />
            </section>

            <Separator className="bg-slate-100" />

            {/* Phần 2: Lời mời đã gửi */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Đã gửi yêu cầu
                </h3>
              </div>
              <SentRequests />
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
