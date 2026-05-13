import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, FriendRequest, User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  clearState: () => void;

  // OTP flow
  sendOtp: (payload: {
    email?: string;
    phoneNumber?: string;
    phoneSuffix?: string;
  }) => Promise<void>;

  verifyOtp: (payload: {
    email?: string;
    phoneNumber?: string;
    phoneSuffix?: string;
    otp: string;
  }) => Promise<void>;

  //  auth actions
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean; // infinite-scroll
      nextCursor?: string | null; // phân trang
    }
  >;
  activeConversationId: string | null;
  convoLoading: boolean;
  messageLoading: boolean;
  loading: boolean;
  reset: () => void;

  setActiveConversation: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId?: string) => Promise<void>;
  sendDirectMessage: (
    recipientId: string,
    content: string,
    file?: File | null,
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content: string,
    file?: File | null,
  ) => Promise<void>;
  // add message
  addMessage: (message: Message) => Promise<void>;
  // update convo
  updateConversation: (
    conversation: Partial<Conversation> & { _id: string },
  ) => void;
  markAsSeen: () => Promise<void>;
  addConvo: (convo: Conversation) => void;
  createConversation: (
    type: "group" | "direct",
    name: string,
    memberIds: string[],
  ) => Promise<void>;
  deleteConversation: (convoId: string) => Promise<void>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  friends: Friend[];
  loading: boolean;
  receivedList: FriendRequest[];
  sentList: FriendRequest[];
  searchByUsername: (username: string) => Promise<User | null>;
  addFriend: (to: string, message?: string) => Promise<string>;
  getAllFriendRequests: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  getFriends: () => Promise<void>;
  unreadRequestCount: number;
  incrementUnreadRequest: () => void;
  clearUnreadRequest: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addNewReceivedRequest: (request: any) => void;
}

export interface UserState {
  updateAvatarUrl: (formData: FormData) => Promise<void>;
}
