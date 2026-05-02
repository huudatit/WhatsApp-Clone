import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { User } from "@/types/user";
import Logout from "../auth/Logout";

export function NavUser({ user }: { user: User }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between px-2 py-2">

          {/* LEFT: avatar + name */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>
                {user.displayName?.charAt(0)}
              </AvatarFallback>
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

          {/* RIGHT: logout */}
          <div className="flex items-center gap-1 text-red-400 hover:text-red-300 cursor-pointer">
            <Logout />
          </div>

        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
