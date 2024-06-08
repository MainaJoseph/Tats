import Container from "@/app/components/Container";
import {
  MdLogout,
  MdManageAccounts,
  MdOutlineBorderColor,
} from "react-icons/md";

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
import { UpdatedTabs } from "./UpdatedTabs";

const AccountProfile = () => {
  return (
    <div className="mt-7">
      <Container>
        <div className="flex flex-col md:flex-row justify-items-start gap-6">
          {/* div 1 */}
          <div className="flex flex-col gap-4 md:flex md:justify-start md:w-1/3 ">
            <div className="font-bold text-2xl">My Profile</div>
            <div className="flex flex-col gap-8 shadow-md">
              <div>Name</div>
              <div className="flex ml-5 flex-row gap-1 items-center cursor-pointer  text-slate-700 hover:text-sky-400">
                <MdManageAccounts size={30} />
                <div className="text-sm text-center font-semibold">
                  Personal Information
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <div className="flex ml-5 flex-row gap-1 items-center cursor-pointer  text-slate-700 hover:text-orange-400 mb-7">
                    <MdLogout size={27} />
                    <div className="text-sm text-center font-semibold">
                      Logout
                    </div>
                  </div>
                </AlertDialogTrigger>
                {/* Confirmation Dialog */}
                <AlertDialogContent className="bg-white text-slate-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out from Nova. But do not worry you can
                      login again😊.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-700 hover:bg-slate-500 text-white transition translate-y-1">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-rose-500 hover:bg-rose-300 text-white transition translate-y-1">
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {/* div 2 */}
          <div className="md:w-2/3">
            <UpdatedTabs />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AccountProfile;
