import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { UserPlus } from "lucide-react";
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchForm from "@/components/AddFriendModal/SearchForm";
import SendFriendRequestForm from "@/components/AddFriendModal/SendFriendRequestForm";
import { SidebarGroupAction } from "@/components/ui/sidebar";

export interface IFormValues {
  username: string;
  message: string;
}

const AddFriendModal = () => {
  // ✅ Thêm state quản lý trạng thái đóng/mở của Modal
  const [isOpen, setIsOpen] = useState(false);

  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchedUsername, setSearchedUsername] = useState("");
  const { loading, searchByUsername, addFriend } = useFriendStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: { username: "", message: "" },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const usernameValue = watch("username");

  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) return;

    setIsFound(null);
    setSearchedUsername(username);

    try {
      const foundUser = await searchByUsername(username);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;

    try {
      const message = await addFriend(searchUser._id, data.message.trim());
      toast.success(message);
      handleCancel(); // Sẽ đóng modal và reset form
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      toast.error((error as Error).message || "Không thể gửi yêu cầu kết bạn");
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedUsername("");
    setIsFound(null);
    setIsOpen(false); // ✅ Đóng modal
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleCancel(); 
    }
  };

  return (
    <>
      <SidebarGroupAction
        title="Kết Bạn"
        className="cursor-pointer text-blue-400 hover:text-blue-300"
        onClick={() => setIsOpen(true)}
      >
        <UserPlus className="size-4" />
        <span className="sr-only">Kết bạn</span>
      </SidebarGroupAction>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-106.25 border-none cursor-pointer">
          <DialogHeader>
            <DialogTitle>Kết Bạn</DialogTitle>
          </DialogHeader>

          {!isFound && (
            <SearchForm
              register={register}
              errors={errors}
              usernameValue={usernameValue}
              loading={loading}
              isFound={isFound}
              searchedUsername={searchedUsername}
              onSubmit={handleSearch}
              onCancel={handleCancel}
            />
          )}

          {isFound && (
            <SendFriendRequestForm
              register={register}
              loading={loading}
              searchedUsername={searchedUsername}
              onSubmit={handleSend}
              onBack={() => setIsFound(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddFriendModal;
