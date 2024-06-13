"use client";

import Container from "@/app/components/Container";
import { MdManageAccounts } from "react-icons/md";
import { UpdatedTabs } from "./UpdatedTabs";
import { LogoutAccount } from "./logout-account";
import { useCurrentUser } from "@/hooks/use-current-user";
import { format } from "date-fns";

export const AccountProfile = () => {
  const user = useCurrentUser();

  const formattedDate = user?.createdAt
    ? format(new Date(user.createdAt), "PPP")
    : "";

  return (
    <div className="mt-7">
      <Container>
        <div className="flex flex-col md:flex-row justify-items-start gap-6">
          <div className="flex flex-col gap-4 md:flex md:justify-start md:w-1/3">
            <div className="font-bold text-2xl">My Profile</div>
            <div className="flex flex-col gap-1">
              <div className="text-slate-900 font-semibold text-md">
                {user?.name}
              </div>
              <div className="text-slate-900 font-normal text-sm">
                {user?.email}
              </div>
              <div className="text-slate-900 font-normal text-sm">
                {formattedDate}
              </div>
            </div>
            <div className="flex flex-col gap-8 shadow-md">
              <div className="flex ml-5 flex-row gap-1 items-center cursor-pointer text-slate-700 hover:text-sky-400">
                <MdManageAccounts size={30} />
                <div className="text-sm text-center font-semibold mt-2">
                  Personal Information
                </div>
              </div>
              <LogoutAccount />
            </div>
          </div>
          <div className="md:w-2/3">
            <UpdatedTabs />
          </div>
        </div>
      </Container>
    </div>
  );
};
