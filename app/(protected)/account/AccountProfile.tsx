"use client";

import { memo } from "react";
import Container from "@/app/components/Container";
import { MdManageAccounts } from "react-icons/md";
import { useCurrentUser } from "@/hooks/use-current-user";
import { format } from "date-fns";
import { FaRegCalendarAlt } from "react-icons/fa";
import Avatar from "@/app/components/avatar/Avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogoutAccount } from "./logout-account";
import { UpdatedTabs } from "../UpdatedTabs";

export const AccountProfile = memo(() => {
  const user = useCurrentUser();

  const formattedDate = user?.createdAt
    ? format(new Date(user.createdAt), "MMM yyyy")
    : "";

  return (
    <div className="mt-7">
      <Container>
        <div className="flex flex-col md:flex-row justify-items-start gap-6">
          <div className="flex flex-col gap-4 md:flex md:justify-start md:w-1/3">
            <div className="font-bold text-2xl">My Profile</div>
            <div className="w-full flex flex-col gap-1 border-none">
              <div className="ml-3">
                <div className="flex flex-row items-center space-x-4">
                  <Avatar />
                  <div className="flex flex-col">
                    <div className="text-slate-900 font-semibold text-md">
                      {user?.name}
                    </div>
                    <div className="text-slate-900 font-normal text-sm">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-1 text-slate-900 font-normal text-xs mt-4 ml-10">
                  <FaRegCalendarAlt />
                  <span> Joined on :</span> {""}
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex flex-row gap-4 mt-4 ml-10 items-center">
                  <p className="text-sm font-semibold text-slate-500">
                    Two Factor Authentication
                  </p>
                  <Separator
                    orientation="vertical"
                    className="text-slate-900"
                  />
                  <Badge
                    variant={
                      user?.isTwoFactorEnabled ? "success" : "destructive"
                    }
                    className="text-white"
                  >
                    {user?.isTwoFactorEnabled ? "ON" : "OFF"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 shadow-md mt-5">
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
});

AccountProfile.displayName = "AccountProfile";
