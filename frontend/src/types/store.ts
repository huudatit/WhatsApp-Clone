import { create } from "zustand";
import { persist } from "zustand/middleware"; 
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
  reset: () => void;

  setActiveConversation: (id: string | null) => void;   
  fetchConversations: () => Promise<void>;  
  fetchMessages: (conversationId?: string) => Promise<void>;  
  sendDirectMessage: (
    recipientId: string,
    content: string,
    imgUrl?: string
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content: string,
    imgUrl?: string
  ) => Promise<void>;
  // add message
  addMessage: (message: Message) => Promise<void>;
  // update convo                 
}