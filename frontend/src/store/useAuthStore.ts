import { create } from "zustand";
import { toast } from "sonner";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";
import { AuthService } from "@/services/AuthService";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,
      isCheckingAuth: true,

      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        useChatStore.getState().reset();
        localStorage.clear();
        sessionStorage.clear();
      },

      //  Gửi OTP
      sendOtp: async (payload) => {
        try {
          set({ loading: true });

          await AuthService.sendOtp(payload);

          toast.success("OTP đã được gửi!");
        } catch (error) {
          console.error(error);
          toast.error("Gửi OTP thất bại!");
        } finally {
          set({ loading: false });
        }
      },

      //  Verify OTP → LOGIN LUÔN
      verifyOtp: async (payload) => {
        try {
          set({ loading: true });

          const { accessToken, user } =
            await AuthService.verifyOtp(payload);

          set({ accessToken, user });

          //Lay thong tin User
          await get().fetchMe();
          // load data chat
          useChatStore.getState().fetchConversations();

          toast.success("Đăng nhập thành công ");
        } catch (error) {
          console.error(error);
          toast.error("OTP không hợp lệ!");
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          await AuthService.logout();
          get().clearState();

          toast.success("Logout thành công!");
        } catch (error) {
          console.error(error);
          toast.error("Lỗi khi logout!");
        }
      },

      fetchMe: async () => {
        try {
          if (!get().accessToken) {
            set({ isCheckingAuth: false });
            return;
          }

          set({ isCheckingAuth: true });
          const user = await AuthService.fetchMe();
          set({ user });
        } catch (error: any) {
          console.error("Lỗi fetchMe:", error);
          
          if (error.response?.status === 401 || error.response?.status === 403) {
            get().clearState();
          }
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      refresh: async () => {
        try {
          const accessToken = await AuthService.refresh();
          set({ accessToken });
        } catch (error) {
          console.error(error);
          get().clearState();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
