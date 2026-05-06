import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white flex items-center justify-center gap-2 shadow-sm transition-all rounded-xl py-3 text-sm"
      onClick={handleLogout}
    >
      <LogOut size={18} />
      <span>Log out</span>
    </Button>
  );
};

export default Logout;