import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import { MessageSquare } from "lucide-react"; 

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-slate-50">
      <ChatWindowHeader />
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="flex flex-col h-full w-full max-w-7xl items-center justify-center bg-white border border-slate-100 rounded-3xl shadow-lg shadow-blue-950/5 p-10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/10 hover:-translate-y-1">
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Vòng tròn Icon với Hiệu ứng Đẹp (Không Animation) */}
            <div className="size-28 mb-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center shadow-inner border border-blue-200/50 group relative">
              {/* Hiệu ứng bóng đổ mờ xung quanh (Glow) */}
              <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-2xl opacity-70"></div>
              
              {/* Sử dụng Icon từ Lucide-React */}
              <div className="relative size-16 bg-white rounded-3xl flex items-center justify-center shadow-md border border-slate-100 transition-transform duration-300 group-hover:scale-110">
                <MessageSquare className="size-8 text-blue-600" />
              </div>
            </div>
            
            {/* Tiêu đề 1 */}
            <h1 className="text-3xl md:text-4xl font-extrabold mb-5 tracking-tight whitespace-nowrap bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              WELCOME TO CHAT APP!
            </h1>
            
            {/* Phụ đề 2 */}
            <p className="text-slate-400 text-sm md:text-base font-medium whitespace-nowrap tracking-wide uppercase opacity-80">
                Please select a conversation from the left to start a new chat
            </p>
            
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;