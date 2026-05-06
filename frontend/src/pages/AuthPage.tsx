import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import { OtpForm } from "@/components/OTPForm";
import { MessageSquare } from "lucide-react"; 
import LoginIllustration from "../assets/login-img.svg";

export default function AuthPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* NỬA TRÁI - MINH HỌA */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 via-white to-blue-100 flex-col items-center justify-center p-12 relative overflow-hidden">
        
        {/* Vòng tròn trang trí background */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>

        {/* Logo Icon */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg mb-8 z-10">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 z-10 text-center">
          Connect to your friends.
        </h1>
        <p className="text-slate-500 mb-12 text-center max-w-md z-10">
          Trải nghiệm nhắn tin mượt mà và miễn phí cùng.
        </p>

        {/* Image*/}
        <div className="w-full max-w-lg z-10 drop-shadow-lg p-6">
          <img 
            src={LoginIllustration} 
            alt="Design Review Illustration"
            className="w-full h-auto" 
          />
        </div>
      </div>

      {/* NỬA PHẢI - FORM ĐĂNG NHẬP */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header của form */}
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-blue-600 mb-2">
              {step === "email" ? "Sign in" : "Enter OTP"}
            </h2>
            <p className="text-sm text-slate-500">
              {step === "email"
                ? "Free access to our dashboard."
                : "Check your email for the secret code."}
            </p>
          </div>

          {/* Render Form tương ứng */}
          <div className="mt-8">
            {step === "email" ? (
              <LoginForm 
                onSuccess={(emailParam) => {
                  setEmail(emailParam);
                  setStep("otp");
                }} 
              />
            ) : (
              <OtpForm email={email} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}