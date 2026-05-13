import { userService } from "@/services/userService";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";
import type { User } from "@/types/user";

interface UserState {
  updateAvatarUrl: (formData: FormData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>(() => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: `${data.avatarUrl}?t=${new Date().getTime()}`,
        });

        useChatStore.getState().fetchConversations();
      }
    } catch (error) {
      console.error("Lỗi khi updateAvatarUrl", error);
      toast.error("Upload avatar không thành công!");
    }
  },
  // Trong useUserStore.ts
  updateProfile: async (data: Partial<User>) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const res = await userService.updateProfile(data);

      const updatedData = res.data;

      if (user) {
        setUser({
          ...user,
          ...updatedData, 
        });
      }

      toast.success("Hồ sơ đã được cập nhật!");
 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Lỗi khi updateProfile:", error);
      const errorMessage =
        error?.response?.data?.message || "Không thể cập nhật hồ sơ";
      toast.error(errorMessage);
    }
  },
}));
