import api from "@/lib/axios";

export const friendService = {
  async searchByUsername(username: string) {
    const res = await api.get(`/users/search?username=${username}`);
    return res.data.data.user;
  },

  async sendFriendRequest(to: string, message?: string) {
    // const res = await api.post("/friends/requests", { to, message });
    // return res.data.message;
    try {
      const res = await api.post("/friends/requests", { to, message });
      return res.data.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Bóc tách lỗi chi tiết từ Backend trả về
      if (error.response && error.response.data) {
        const backendMessage = error.response.data.message;
        console.error("🐞 [DEBUG API] Nguyên nhân từ khóa:", backendMessage);

        // Ném lỗi với message chuẩn để UI (Store/Modal) có thể hiển thị
        throw new Error(backendMessage);
      }

      console.error(
        "🐞 [DEBUG API] Lỗi mạng hoặc server không phản hồi:",
        error,
      );
      throw error;
    }
  },

  async getAllFriendRequest() {
    try {
      const res = await api.get("/friends/requests");
      const { sent, received } = res.data.data;
      return { sent, received };
    } catch (error) {
      console.error("Lỗi khi gửi getAllFriendRequest", error);
    }
  },

  async acceptRequest(requestId: string) {
    try {
      const res = await api.post(`/friends/requests/${requestId}/accept`);
      return res.data.requestAcceptedBy;
    } catch (error) {
      console.error("Lỗi khi gửi acceptRequest", error);
    }
  },

  async declineRequest(requestId: string) {
    try {
      await api.post(`/friends/requests/${requestId}/decline`);
    } catch (error) {
      console.error("Lỗi khi gửi declineRequest", error);
    }
  },

  async getFriendList() {
    const res = await api.get("/friends");
    return res.data.data.friends;
  },
};
