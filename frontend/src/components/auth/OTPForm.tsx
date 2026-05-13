import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";


export function OtpForm({ email }: { email: string }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // Khởi tạo navigate
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      console.log("Dữ liệu Verify OTP:", res.data);

      const { accessToken, user } = res.data.data;

      setUser(user);
      setAccessToken(accessToken);

      // ÉP CHUYỂN TRANG NGAY LẬP TỨC SAU KHI LƯU STATE
      navigate("/chat");
    } catch (err) {
      console.error("Lỗi xác nhận OTP:", err);
      setError("OTP không đúng hoặc hết hạn");
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">OTP đã gửi tới: {email}</p>

      <Input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="focus-visible:ring-blue-500"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        Verify OTP
      </Button>
    </form>
  );
}
