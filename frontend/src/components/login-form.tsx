import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import api from "@/lib/axios";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export function LoginForm({
  className,
  onSuccess,
  ...props
}: React.ComponentProps<"div"> & {
  onSuccess: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid email");
      return;
    }

    try {
      await api.post("/auth/send-otp", { email });

      setError("");
      onSuccess(email); // chuyển sang OTP screen
    } catch (err) {
      setError("Gửi OTP thất bại");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-600">
            Login with OTP
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSendOtp} className="flex flex-col gap-3">

            {/* EMAIL */}
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-visible:ring-blue-500"
              required
            />

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* SEND OTP */}
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Send OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
