import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { ArrowLeft, Pencil, Check, Camera } from "lucide-react";
import UserAvatar from "../chat/UserAvatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ProfileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSidebar = ({ open, onOpenChange }: ProfileSidebarProps) => {
  const { user } = useAuthStore();
  const { updateAvatarUrl, updateProfile } = useUserStore(); 

  // State quản lý việc chỉnh sửa inline
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  if (!user) return null;

  const handleEdit = (field: string, currentVal: string) => {
    setEditingField(field);
    setTempValue(currentVal);
  };

  const handleSave = async (field: string) => {
    await updateProfile({ [field]: tempValue });
    setEditingField(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:w-100 p-0 border-r border-border/30 bg-[#f0f2f5] dark:bg-[#111b21] flex flex-col"
      >
        {/* Header: Màu xanh đặc trưng WhatsApp */}
        <div className="h-27 bg-[#008069] dark:bg-[#202c33] flex items-end p-5 text-white shrink-0">
          <div className="flex items-center gap-6 mb-1">
            <button
              onClick={() => onOpenChange(false)}
              className="hover:bg-white/10 p-1 rounded-full transition"
            >
              <ArrowLeft className="size-6" />
            </button>
            <h2 className="text-[19px] font-medium">Hồ sơ</h2>
          </div>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Section 1: Avatar với hiệu ứng Hover Camera */}
          <div className="flex justify-center py-7">
            <div className="relative group cursor-pointer overflow-hidden rounded-full size-52">
              <UserAvatar
                type="profile"
                name={user.username}
                avatarUrl={user.avatarUrl ?? undefined}
                className="size-full ring-0 scale-105"
              />
              <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="size-6 mb-2" />
                <span className="text-[13px] uppercase text-center px-4 font-light">
                  Thay đổi <br /> ảnh đại diện
                </span>
                {/* Input ẩn từ AvatarUploader */}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("file", file);
                      updateAvatarUrl(formData);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tên của bạn (Editable) */}
          <div className="bg-white dark:bg-[#111b21] px-8 py-4 shadow-sm mb-[10px]">
            <Label className="text-[#008069] dark:text-[#00a884] text-[14px] font-normal mb-3 block">
              Tên của bạn
            </Label>
            <div className="flex items-center justify-between gap-4">
              {editingField === "username" ? (
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                  className="border-b-2 border-[#00a884] border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0 h-8 text-[17px] bg-transparent"
                />
              ) : (
                <span className="text-[#3b4a54] dark:text-[#e9edef] text-[17px]">
                  {user.username}
                </span>
              )}

              <button
                onClick={() =>
                  editingField === "username"
                    ? handleSave("username")
                    : handleEdit("username", user.username)
                }
                className="text-[#8696a0] hover:text-[#54656f] transition"
              >
                {editingField === "username" ? (
                  <Check className="size-5" />
                ) : (
                  <Pencil className="size-5" />
                )}
              </button>
            </div>
            <p className="text-[#8696a0] text-[13px] mt-6 leading-[1.4] font-light">
              Đây không phải là tên người dùng hoặc mã PIN của bạn. Tên này sẽ
              hiển thị với các liên hệ trên WhatsApp.
            </p>
          </div>

          {/* Section 3: Thông tin (About/Bio) */}
          <div className="bg-white dark:bg-[#111b21] px-8 py-4 shadow-sm mb-[10px]">
            <Label className="text-[#008069] dark:text-[#00a884] text-[14px] font-normal mb-3 block">
              Thông tin
            </Label>
            <div className="flex items-center justify-between gap-4">
              {editingField === "bio" ? (
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                  className="border-b-2 border-[#00a884] border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0 h-8 text-[17px] bg-transparent"
                />
              ) : (
                <span className="text-[#3b4a54] dark:text-[#e9edef] text-[17px] truncate">
                  {user.bio || "Available"}
                </span>
              )}

              <button
                onClick={() =>
                  editingField === "bio"
                    ? handleSave("bio")
                    : handleEdit("bio", user.bio || "Available")
                }
                className="text-[#8696a0] hover:text-[#54656f] transition"
              >
                {editingField === "bio" ? (
                  <Check className="size-5" />
                ) : (
                  <Pencil className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Section 4: Số điện thoại (Read-only phong cách WA) */}
          <div className="bg-white dark:bg-[#111b21] px-8 py-4 shadow-sm">
            <Label className="text-[#008069] dark:text-[#00a884] text-[14px] font-normal mb-3 block">
              Số điện thoại
            </Label>
            <div className="flex items-center justify-between">
              <span className="text-[#3b4a54] dark:text-[#e9edef] text-[17px]">
                {user.phone || "+84 123 456 789"}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSidebar;
