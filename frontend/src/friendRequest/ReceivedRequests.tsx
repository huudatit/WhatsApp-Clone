import { useFriendStore } from "@/store/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Inbox } from "lucide-react";

const ReceivedRequests = () => {
  const { acceptRequest, declineRequest, loading, receivedList } = useFriendStore();

  if (!receivedList || receivedList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <Inbox className="size-12 text-muted-foreground mb-3 opacity-20" />
        <p className="text-sm font-medium text-muted-foreground">
          Bạn chưa có lời mời kết bạn nào.
        </p>
      </div>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      toast.success("Đã đồng ý kết bạn thành công");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.info("Đã từ chối kết bạn");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-2">
      {receivedList.map((req) => (
        <FriendRequestItem
          key={req._id}
          requestInfo={req}
          actions={
            <div className="flex gap-2">
              <Button size="sm" className="h-8" variant="default" onClick={() => handleAccept(req._id)} disabled={loading}>
                Chấp nhận
              </Button>
              <Button size="sm" className="h-8" variant="secondary" onClick={() => handleDecline(req._id)} disabled={loading}>
                Từ chối
              </Button>
            </div>
          }
          type="received"
        />
      ))}
    </div>
  );
};

export default ReceivedRequests;