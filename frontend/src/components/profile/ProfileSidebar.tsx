import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import {
  ArrowLeft,
  Pencil,
  Check,
  Camera,
  LogOut,
  User as UserIcon,
  Info,
} from "lucide-react";
import UserAvatar from "../chat/UserAvatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router";

interface ProfileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSidebar = ({ open, onOpenChange }: ProfileSidebarProps) => {
  const { user, signOut } = useAuthStore();
  const { updateAvatarUrl, updateProfile } = useUserStore();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:w-100 p-0 border-r border-border/30 bg-[#f0f2f5] dark:bg-[#0b141a] flex flex-col"
      >
        {/* Header - đồng bộ gradient với sidebar chính */}
        <div className="h-28 bg-linear-to-r from-blue-500 to-cyan-500 flex items-end p-5 text-white shrink-0 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/3 size-24 bg-white/10 rounded-full blur-xl" />

          <div className="flex items-center gap-4 mb-1 relative z-10">
            <button
              onClick={() => onOpenChange(false)}
              className="hover:bg-white/15 p-2 rounded-full transition cursor-pointer"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h2 className="text-lg font-semibold tracking-wide">Hồ sơ</h2>
          </div>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto beautiful-scrollbar flex flex-col px-4 pb-6 gap-3">
          {/* Avatar - kéo lên đè vào header */}
          <div className="flex justify-center mt-8 mb-1">
            <div className="relative group">
              <div className="size-28 rounded-full ring-4 ring-[#f0f2f5] dark:ring-[#0b141a] shadow-lg overflow-hidden bg-blue-100 dark:bg-blue-900/40">
                <UserAvatar
                  type="profile"
                  name={user.username}
                  avatarUrl={user.avatarUrl ?? undefined}
                  className="size-full rounded-none"
                />
              </div>

              <label className="absolute -bottom-1 -right-1 size-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md cursor-pointer transition">
                <Camera className="size-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("file", file);
                      updateAvatarUrl(formData);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Tên + email */}
          <div className="text-center mb-1">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {user.username}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Tên của bạn */}
          <div className="bg-white dark:bg-[#111b21] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <UserIcon className="size-4 text-blue-500" />
              </div>
              <Label className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Tên của bạn
              </Label>
            </div>

            <div className="flex items-center justify-between gap-3 pl-10">
              {editingField === "username" ? (
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                  className="h-9"
                />
              ) : (
                <span className="text-slate-700 dark:text-slate-200 text-base truncate">
                  {user.username}
                </span>
              )}

              <button
                onClick={() =>
                  editingField === "username"
                    ? handleSave("username")
                    : handleEdit("username", user.username)
                }
                className="text-slate-400 hover:text-blue-500 transition cursor-pointer shrink-0"
              >
                {editingField === "username" ? (
                  <Check className="size-4" />
                ) : (
                  <Pencil className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Thông tin / bio */}
          <div className="bg-white dark:bg-[#111b21] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Info className="size-4 text-blue-500" />
              </div>
              <Label className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Thông tin
              </Label>
            </div>

            <div className="flex items-center justify-between gap-3 pl-10">
              {editingField === "bio" ? (
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                  className="h-9"
                />
              ) : (
                <span className="text-slate-700 dark:text-slate-200 text-base truncate">
                  {user.bio || "Available"}
                </span>
              )}

              <button
                onClick={() =>
                  editingField === "bio"
                    ? handleSave("bio")
                    : handleEdit("bio", user.bio || "Available")
                }
                className="text-slate-400 hover:text-blue-500 transition cursor-pointer shrink-0"
              >
                {editingField === "bio" ? (
                  <Check className="size-4" />
                ) : (
                  <Pencil className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Đăng xuất */}
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50 transition py-3 font-medium cursor-pointer shadow-sm"
          >
            <LogOut className="size-5" />
            Đăng xuất
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSidebar;
