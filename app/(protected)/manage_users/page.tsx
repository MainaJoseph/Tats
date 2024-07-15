import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import ManageUsersClient from "./manage-users-client";

export const metadata: Metadata = {
  title: "Manage Users",
  description:
    "This is you can see all the users, add users and manage their role",
};

export default function ManageUsers() {
  return (
    <>
      <DefaultLayout>
        <ManageUsersClient />
      </DefaultLayout>
    </>
  );
}
