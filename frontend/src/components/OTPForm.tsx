import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { z } from "zod";

const schema = z.object({
  otp: z.string().min(4, "OTP không hợp lệ"),
});

export function OtpForm({ email }: { email: string }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const setUser = useAuthStore((state) => state.setUser);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const res = await api.post("/auth/verify-otp", {
        email,
        otp,
        });

        const { accessToken, user } = res.data.data;

        setUser(user);
        setAccessToken(accessToken);

    } catch (err) {
        setError("OTP không đúng hoặc hết hạn");
    }
};


  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        OTP đã gửi tới: {email}
      </p>

      <Input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="focus-visible:ring-blue-500"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="bg-blue-600 hover:bg-blue-700">
        Verify OTP
      </Button>
    </form>
  );
}
