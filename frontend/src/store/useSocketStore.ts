import { create } from "zustand";
import { io, type Socket } from "socket.io-client"
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return; // tránh tạo nhiều socket

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Đã kết nối với socket");
    });

    // online users
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // new message
    // new message
    socket.on("new-message", (payload) => {
      // 1. Kiểm tra nếu Backend gửi thiếu đồ thì chặn lại luôn, không cho sập web
      if (!payload || !payload.message || !payload.conversation) {
        console.error("🚨 Backend gửi thiếu dữ liệu! Payload:", payload);
        return; 
      }

      const { message, conversation, unreadCounts } = payload;

      // 2. Nhét tin nhắn vào kho
      useChatStore.getState().addMessage(message);

      // 3. Tạo lastMessage siêu an toàn (Có dấu ? để chống sập)
      const lastMessage = {
        _id: conversation?.lastMessage?._id || message._id,
        content: conversation?.lastMessage?.content || message.content,
        createdAt: conversation?.lastMessage?.createdAt || message.createdAt,
        sender: {
          _id: conversation?.lastMessage?.senderId || message.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts: unreadCounts || {},
      };

      if (useChatStore.getState().activeConversationId === message.conversationId) {
        useChatStore.getState().markAsSeen();
      }

      useChatStore.getState().updateConversation(updatedConversation);
    });

    // read message
    socket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };

      useChatStore.getState().updateConversation(updated);
    });

    // new group chat
    socket.on("new-group", (conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit("join-conversation", conversation._id);
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
