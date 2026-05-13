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

    return res.data?.data?.user || res.data?.data || res.data?.user || res.data;
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
