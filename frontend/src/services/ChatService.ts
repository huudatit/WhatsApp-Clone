import api from "@/lib/axios";
import type { ConversationResponse, Message, Conversation } from "@/types/chat";

// LUỒNG CHÍNH
interface FetchMessageProps {
  messages: Message[];
  cursor?: string; //luu con tro phan trang
}

const pageLimit = 50;

export const ChatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const res = await api.get("/conversations");
    return res.data;
  },

  async fetchMessages(id: string, cursor?: string) : Promise<FetchMessageProps> {
    const res = await api.get(
      `/conversations/${id}/messages?limit=${pageLimit}&cursor=${cursor || ""}`
    );

    const data = res.data?.data || res.data;

    return {
      messages: data?.messages || [],
      cursor: data?.nextCursor
    };
  },

  async sendDirectMessage(
    recipientId: string,
    content: string = "",
    imgUrl?: string,
    conversationId?: string
  ) {
    const res = await api.post("/messages/direct", {
      recipientId,
      content,
      imgUrl,
      conversationId,
    });

    return res.data.message;
  },

  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    imgUrl?: string
  ) {
    const res = await api.post("/messages/group", {
      conversationId,
      content,
      imgUrl,
    });
    return res.data.message;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`/conversations/${conversationId}/seen`);
    return res.data;
  },

  async createConversation(
    type: "direct" | "group",
    name: string,
    memberIds: string[]
  ) {
    const res = await api.post("/conversations", { type, name, memberIds });
    return res.data?.data?.conversation || res.data?.conversation || res.data;
  },

  deleteConversation: async (conversationId: string) => {
    try {
      const response = await api.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi ở ChatService.deleteConversation:", error);
      throw error;
    }
  },

};