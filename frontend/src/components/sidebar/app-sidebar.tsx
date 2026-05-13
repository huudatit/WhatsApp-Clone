import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
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
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const { convoLoading, fetchConversations } = useChatStore();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // const currentUser = {
  //   _id: user?._id || "",
  //   username: user?.username,
  //   email: user?.email || "",
  //   avatarUrl:
  //     user?.avatarUrl ||
  //     `https://ui-avatars.com/api/?name=${user?.username}&background=random`,
  // };

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

          <SidebarGroupAction
            title="Kết Bạn"
            className="cursor-pointer text-blue-400 hover:text-blue-300"
          >
            <AddFriendModel />
          </SidebarGroupAction>

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
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
