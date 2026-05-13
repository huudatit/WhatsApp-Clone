import { ChatService } from "@/services/ChatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { useSocketStore } from "./useSocketStore";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false, // convo loading
      messageLoading: false,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        });
      },
      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          
          // Lấy nguyên  response từ API về
          const res = await ChatService.fetchConversations() as any;

          const fetchedConvos = res?.conversations || res?.data?.conversations || res?.message?.conversations || [];

          set({ conversations: fetchedConvos, convoLoading: false });
        } catch (error) {
          console.error("Lỗi xảy ra khi fetchConversations:", error);
          set({ convoLoading: false });
        }
      },
      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });

        try {
          const { messages: fetched, cursor } = await ChatService.fetchMessages(
            convoId,
            nextCursor
          );

          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged = prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi fetchMessages:", error);
        } finally {
          set({ messageLoading: false });
        }
      },
      
      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();

          // 1. HỨNG TIN NHẮN TRẢ VỀ TỪ API
          const newMessage = await ChatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined
          );

          // 2. NHÉT NGAY VÀO KHO ĐỂ MÀN HÌNH TỰ UPDATE
          if (newMessage) {
            get().addMessage(newMessage);
          }

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra khi gửi direct message", error);
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          const newMessage = await ChatService.sendGroupMessage(conversationId, content, imgUrl);
          
          // 2. NHÉT VÀO KHO
          if (newMessage) {
            get().addMessage(newMessage);
          }
          
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === get().activeConversationId ? { ...c, seenBy: [] } : c
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra gửi group message", error);
        }
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;
          const convoId = message.conversationId;

          let prevItems = get().messages[convoId]?.items ?? [];

          if (prevItems.length === 0) {
            await fetchMessages(message.conversationId);
            prevItems = get().messages[convoId]?.items ?? [];
          }

          set((state) => {
            if (prevItems.some((m) => m._id === message._id)) {
              return state;
            }

            const currentMessageData = state.messages[convoId] || {
              items: [],
              hasMore: false,
              nextCursor: undefined
            };

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItems, message],
                  hasMore: currentMessageData.hasMore, 
                  nextCursor: currentMessageData.nextCursor,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy khi ra add message:", error);
        }
      },

      updateConversation: (conversation: any) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c
          ),
        }));
      },

      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) {
            return;
          }

          const convo = conversations.find((c) => c._id === activeConversationId);

          if (!convo) {
            return;
          }

          if ((convo.unreadCounts?.[user._id] ?? 0) === 0) {
            return;
          }

          await ChatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user._id]: 0,
                    },
                  }
                : c
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra khi gọi markAsSeen trong store", error);
        }
      },

      addConvo: (convo) => {
        set((state) => {
          // 1. Tạo biến an toàn
          const currentConvos = state.conversations || [];

          // 2. Dùng biến an toàn để kiểm tra
          const exists = currentConvos.some((c: any) => c._id === convo._id);

          // 3. Dùng biến an toàn để return luôn
          return {
            conversations: exists 
              ? currentConvos // Đổi chữ này
              : [convo, ...currentConvos], // VÀ đổi luôn chữ này
            activeConversationId: convo._id,
          };
        });
      },

      createConversation: async (type, name, memberIds) => {
        try {
          set({ convoLoading: true });
          const conversation = await ChatService.createConversation(
            type,
            name,
            memberIds
          );

          get().addConvo(conversation);

          useSocketStore
            .getState()
            .socket?.emit("join-conversation", conversation._id);
        } catch (error) {
          console.error("Lỗi xảy ra khi gọi createConversation trong store", error);
        } finally {
          set({ convoLoading: false });
        }
      },

      removeConversation: async (conversationId: string) => {
        try {
          // Gọi API lên Backend (Em cần tự thêm hàm deleteConversation trong ChatService nhé)
          await ChatService.deleteConversation(conversationId);
          
          set((state) => ({
            // Lọc bỏ cái đoạn chat vừa bị xóa ra khỏi mảng
            conversations: (state.conversations || []).filter(c => c._id !== conversationId),
            // Nếu đoạn chat đang mở bị xóa thì reset về màn hình Welcome
            activeConversationId: state.activeConversationId === conversationId ? null : state.activeConversationId
          }));
        } catch (error) {
          console.error("Lỗi khi xóa trò chuyện:", error);
        }
      },

    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    }
  )
);
