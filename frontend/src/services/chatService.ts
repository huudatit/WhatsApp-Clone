import api from "@/lib/axios";
import type { Conversation, Message } from "@/types/chat";

interface FetchMessageProps {
  messages: Message[];
  cursor?: string;
}

const pageLimit = 50;

export const chatService = {
  async fetchConversations(): Promise<Conversation[]> {
    const res = await api.get("/conversations");

    // Log để kiểm tra (bạn có thể xóa sau khi chạy thành công)
    console.log("FULL response:", JSON.stringify(res.data).slice(0, 300));

    // SỬA Ở ĐÂY: Truy cập trực tiếp res.data.conversations
    return res.data?.data?.conversations ?? [];
  },

  async fetchMessages(id: string, cursor?: string): Promise<FetchMessageProps> {
    const res = await api.get(
      `/conversations/${id}/messages?limit=${pageLimit}&cursor=${cursor}`,
    );

    return {
      messages: res.data.data.messages,
      cursor: res.data.data.nextCursor,
    };
  },

  async sendDirectMessage(
    recipientId: string,
    content: string,
    file?: File | null,
    conversationId?: string,
  ) {
    const formData = new FormData();
    formData.append("recipientId", recipientId);
    formData.append("content", content);
    if (file) formData.append("file", file); // Tên key 'file' phải khớp với upload.single('file') ở route
    if (conversationId) formData.append("conversationId", conversationId);

    const res = await api.post("/messages/direct", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.message;
  },

  async sendGroupMessage(
    conversationId: string,
    content: string,
    file?: File | null,
  ) {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("content", content);
    if (file) formData.append("file", file); 
    if (conversationId) formData.append("conversationId", conversationId);

    const res = await api.post("/messages/group", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.message;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`/conversations/${conversationId}/seen`);
    return res.data.data;
  },

  async createConversation(
    type: "direct" | "group",
    name: string,
    memberIds: string[],
  ) {
    const res = await api.post("/conversations", { type, name, memberIds });
    return res.data.data.conversation;
  },

  async deleteConversation(conversationId: string) {
    const res = await api.delete(`/conversations/${conversationId}`);
    return res.data.conversation;
  },
};
