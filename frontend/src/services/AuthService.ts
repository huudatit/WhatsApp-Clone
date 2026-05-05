import api from "@/lib/axios";

export const AuthService = {
  //  gửi OTP
  sendOtp: async (data: {
    email?: string;
    phoneNumber?: string;
    phoneSuffix?: string;
  }) => {
    const res = await api.post("/auth/send-otp", data, {
      withCredentials: true,
    });

    return res.data;
  },

  //  verify OTP → login luôn
  verifyOtp: async (data: {
    email?: string;
    phoneNumber?: string;
    phoneSuffix?: string;
    otp: string;
  }) => {
    const res = await api.post("/auth/verify-otp", data, {
      withCredentials: true, // nhận cookie refreshToken
    });

    return res.data.data; // { accessToken, user }
  },

  //  logout
  logout: async () => {
    const res = await api.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return res.data;
  },

  //  lấy user (nếu có API này)
  fetchMe: async () => {
    const res = await api.get("/users/me", {
      withCredentials: true,
    });

    return res.data.user;
    // FAKE USER
    // return {
    //   _id: "user_me",
    //   username: "ngocan",
    //   email: "an@example.com",
    //   displayName: "Trần Vũ Ngọc An",
    //   avatarUrl: "https://i.pravatar.cc/150?u=me",
    //   bio: "Đang code dạo",
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // };
  },

  //  refresh accessToken
  refresh: async () => {
    const res = await api.post(
      "/auth/refresh",
      {},
      {
        withCredentials: true, // gửi cookie refreshToken
      }
    );

    return res.data.data; // backend trả accessToken
  },
};
