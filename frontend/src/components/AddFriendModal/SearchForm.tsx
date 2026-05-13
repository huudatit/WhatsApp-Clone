import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogFooter } from "../ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchForm = ({
  register,
  errors,
  usernameValue,
  loading,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  const mainGradient = "bg-gradient-to-r from-blue-500 to-cyan-400";
  
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-semibold text-gray-600">
            Tìm bằng username
          </Label>

        <input
          id="username"
          placeholder="Gõ tên username vào đây..."
          className="w-full border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 rounded-xl py-2 text-base transition-all"          {...register("username", {
            required: "Username không được bỏ trống",
          })}
        ></input>
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}

        {isFound === false && (
          <span className="error-message">
            Không tìm thấy
            <span className="font-semibold">@{searchedUsername}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose>
          <Button
            type="submit"
            disabled={loading}
            className={`flex-1 ${mainGradient} text-white hover:opacity-90 transition-all font-bold shadow-lg rounded-full border-none`}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading}
          className={`flex-1 ${mainGradient} text-white hover:opacity-90 transition-all font-bold shadow-lg rounded-full border-none`}
        >
          {loading ? (
            <span>Đang tìm ...</span>
          ) : (
            <>
              <Search className="size-4 mr-2" /> Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchForm;
