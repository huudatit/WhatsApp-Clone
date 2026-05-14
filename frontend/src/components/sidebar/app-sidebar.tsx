import * as React from "react";

// import { NavUser } from "@/components/sidebar/nav-user";
import CreateNewChat from "../chat/CreateNewChat";
import NewGroupChatModel from "../chat/NewGroupChatModel";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModel from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import ConversationSkeleton from "../skeleton/ConversationSkeleton";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import UserAvatar from "@/components/chat/UserAvatar";
import { Bell } from "lucide-react";
import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestDialog from "../friendRequest/FriendRequestDialog";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const { convoLoading, fetchConversations } = useChatStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { unreadRequestCount, clearUnreadRequest } = useFriendStore();
  const [isFriendReqOpen, setIsFriendReqOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  return (
    <Sidebar variant="inset" className="bg-gradient-blue-300" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="p-0">
              <a href="#" className="w-full">
                <div
                  className="
                  flex w-full items-center px-3 py-3 justify-between 
                  bg-linear-to-r from-blue-500 to-cyan-500
                  hover:from-blue-600 hover:to-cyan-600
                  rounded-xl transition shadow-md
                "
                >
                  <h1 className="text-xl font-bold text-white tracking-wide">
                    Chat App
                  </h1>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="beautiful-scrollbar">
        {/* New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="hover:bg-slate-800 rounded-lg transition p-1">
              <CreateNewChat />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group Chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-xs text-slate-400 tracking-wider">
            Nhóm chat
          </SidebarGroupLabel>

          <SidebarGroupAction
            title="Tạo Nhóm"
            className="cursor-pointer text-blue-400 hover:text-blue-300"
          >
            <NewGroupChatModel />
          </SidebarGroupAction>

          <SidebarGroupContent>
            {convoLoading ? <ConversationSkeleton /> : <GroupChatList />}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-xs text-slate-400 tracking-wider">
            Bạn bè
          </SidebarGroupLabel>

          <AddFriendModel />

          <SidebarGroupContent>
            <div className="space-y-1">
              {convoLoading ? (
                <>
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                </>
              ) : (
                <DirectMessageList />
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="flex flex-row items-center justify-between px-2 py-1 w-full">
          {/* Logo Profile bên trái */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <UserAvatar
              name={user?.username || ""}
              avatarUrl={user?.avatarUrl || ""}
              type={"sidebar"}
            />
          </button>

          {/* Nút thông báo kết bạn bên phải */}
          <button
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => {
              setIsFriendReqOpen(true);
              clearUnreadRequest(); 
            }}
          >
            <Bell size={24} className="text-slate-600 dark:text-slate-300 cursor-pointer" />

            {unreadRequestCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                {unreadRequestCount > 9 ? "9+" : unreadRequestCount}
              </span>
            )}
          </button>
        </div>

        {/* Các Dialogs/Modals */}
        <ProfileSidebar open={isProfileOpen} onOpenChange={setIsProfileOpen} />

        {/* Component bạn đã viết sẵn */}
        <FriendRequestDialog
          open={isFriendReqOpen}
          setOpen={setIsFriendReqOpen}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
