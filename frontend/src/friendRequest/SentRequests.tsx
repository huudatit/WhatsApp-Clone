import { useFriendStore } from "@/store/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { SendHorizontal } from "lucide-react";

const SentRequests = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <SendHorizontal className="size-12 text-muted-foreground mb-3 opacity-20" />
        <p className="text-sm font-medium text-muted-foreground">
          Bạn chưa gửi lời mời kết bạn nào.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sentList.map((req) => (
        <FriendRequestItem
          key={req._id}
          requestInfo={req}
          type="sent"
          actions={
            <p className="text-muted-foreground text-[11px] bg-muted px-2 py-1 rounded-md">Đang chờ...</p>
          }
        />
      ))}
    </div>
  );
};

export default SentRequests;