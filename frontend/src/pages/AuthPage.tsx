import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import { OtpForm } from "@/components/OTPForm";

export default function AuthPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      
      {step === "email" ? (
        <LoginForm
          onSuccess={(emailValue) => {
            setEmail(emailValue);
            setStep("otp");
          }}
        />
      ) : (
        <OtpForm email={email} />
      )}

    </div>
  );
}
