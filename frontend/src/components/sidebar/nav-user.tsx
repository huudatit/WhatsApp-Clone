import { useState } from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

import type { User } from "@/types/user";
import Logout from "../auth/Logout";
import FriendRequestDialog from "@/friendRequest/FriendRequestDialog";

export function NavUser({ user }: { user: User }) {
  // State để đóng/mở cái modal Lời mời kết bạn
  const [openRequests, setOpenRequests] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between px-2 py-2">
          {/* LEFT: avatar + name */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col leading-tight">
              <span className="text-sm text-black font-medium truncate">
                {user.displayName || user.username}
              </span>
              <span className="text-xs text-gray-500 truncate">
                @{user.username}
              </span>
            </div>
          </div>

          {/* RIGHT: Hành động (Bạn bè, Lời mời, Logout) */}
          <div className="flex items-center gap-3">
            {/* Nút Xem lời mời kết bạn */}
            <button 
              onClick={() => setOpenRequests(true)} 
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Lời mời kết bạn"
            >
              <Bell size={18} />
            </button>
            <FriendRequestDialog open={openRequests} setOpen={setOpenRequests} />

            {/* Nút Đăng xuất */}
            <div className="text-red-400 hover:text-red-600 cursor-pointer transition-colors" title="Đăng xuất">
              <Logout />
            </div>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}