import api from "@/lib/axios";
import type { ConversationResponse, Message, Conversation } from "@/types/chat";

// FAKE USER ID
// Tạo sẵn một số Participant mẫu để tái sử dụng
// const p1 = { _id: "u1", displayName: "Nguyễn Văn A", avatarUrl: "https://i.pravatar.cc/150?u=1", joinedAt: new Date().toISOString() };
// const p2 = { _id: "u2", displayName: "Trần Thị B", avatarUrl: "https://i.pravatar.cc/150?u=2", joinedAt: new Date().toISOString() };
// const p3 = { _id: "u3", displayName: "Lê Hoàng C", avatarUrl: "https://i.pravatar.cc/150?u=3", joinedAt: new Date().toISOString() };
// const p4 = { _id: "u4", displayName: "Phạm D", avatarUrl: "https://i.pravatar.cc/150?u=4", joinedAt: new Date().toISOString() };
// const me = { _id: "user_me", displayName: "Trần Vũ Ngọc An", avatarUrl: "https://i.pravatar.cc/150?u=me", joinedAt: new Date().toISOString() };

// // const MOCK_CONVERSATIONS: Conversation[] = [
//   // 1. Group Chat (5 thành viên)
//   {
//     _id: "conv_group_1",
//     type: "group",
//     group: { name: "Team Lập Trình Web", createdBy: "user_me" },
//     participants: [me, p1, p2, p3, p4],
//     lastMessageAt: new Date().toISOString(),
//     seenBy: [{ _id: "user_me" }],
//     unreadCounts: { "user_me": 2 },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     lastMessage: {
//       _id: "msg1",
//       content: "Mọi người test thử UI chat mới nhé!",
//       createdAt: new Date().toISOString(),
//       sender: { _id: p1._id, displayName: p1.displayName, avatarUrl: p1.avatarUrl }
//     }
//   },
//   // 2. Direct Chat 1
//   {
//     _id: "conv_direct_1",
//     type: "direct",
//     group: { name: "", createdBy: "" }, // Direct chat có thể bỏ trống group info
//     participants: [me, p2],
//     lastMessageAt: new Date().toISOString(),
//     seenBy: [{ _id: "user_me" }, { _id: p2._id }],
//     unreadCounts: { "user_me": 0 },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     lastMessage: {
//       _id: "msg2",
//       content: "Gửi API docs cho mình với nha.",
//       createdAt: new Date().toISOString(),
//       sender: { _id: p2._id, displayName: p2.displayName, avatarUrl: p2.avatarUrl }
//     }
//   },
//   // 3. Direct Chat 2
//   {
//     _id: "conv_direct_2",
//     type: "direct",
//     group: { name: "", createdBy: "" },
//     participants: [me, p3],
//     lastMessageAt: new Date().toISOString(),
//     seenBy: [{ _id: "user_me" }],
//     unreadCounts: { "user_me": 0 },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     lastMessage: {
//       _id: "msg3",
//       content: "Oke rùi đó bạn",
//       createdAt: new Date().toISOString(),
//       sender: { _id: "user_me", displayName: "Trần Vũ Ngọc An", avatarUrl: "https://i.pravatar.cc/150?u=me" }
//     }
//   }
// ];

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

    // Giả lập network delay 500ms cho giống thật
    // await new Promise(resolve => setTimeout(resolve, 500));
    // return { conversations: MOCK_CONVERSATIONS };
  },

  async fetchMessages(id: string, cursor?: string) : Promise<FetchMessageProps> {
    const res = await api.get(
      `/conversations/${id}/messages?limit=${pageLimit}&cursor=${cursor}`
    );

    return {messages: res.data.messages, cursor: res.data.nextCursor}

    // Fake Tin nhắn khi bấm vào một hội thoại
    // await new Promise(resolve => setTimeout(resolve, 300));

    // const mockMessages: Message[] = [
    //   {
    //     _id: `msg_1_${id}`,
    //     conversationId: id,
    //     senderId: "u1",
    //     content: "Hello bạn!",
    //     createdAt: new Date(Date.now() - 100000).toISOString(),
    //   },
    //   {
    //     _id: `msg_2_${id}`,
    //     conversationId: id,
    //     senderId: "user_me", // Nhận diện là tin nhắn của mình để UI render sang phải
    //     content: "Hi! Đang test giao diện hả?",
    //     createdAt: new Date(Date.now() - 50000).toISOString(),
    //   }
    // ];

    // return { messages: mockMessages, cursor: undefined }; // cursor undefined để báo là hết data
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
    return res.data.conversation;
  },

};