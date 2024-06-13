import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LuLogOut } from "react-icons/lu";
import { signOut } from "next-auth/react";

export const LogoutAccount = () => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="flex ml-5 flex-row gap-1 items-center cursor-pointer text-slate-700 hover:text-sky-400 mb-7">
            <div className="text-sm text-center font-semibold flex flex-row gap-2">
              <LuLogOut className="hover:text-rose-400" size={22} /> Logout
            </div>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent
          className="bg-white text-slate-900"
          style={{ borderRadius: "5px" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You do not worry you can login at any point and resume where you
              left at.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-rose-500 text-white hover:bg-rose-300"
              style={{ borderRadius: "5px" }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-black text-white hover:bg-slate-800"
              style={{ borderRadius: "5px" }}
              onClick={() => signOut()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
