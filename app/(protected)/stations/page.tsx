import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import AddStationForm from "./add-station";

export const metadata: Metadata = {
  title: "Add station",
  description: "Add stations here",
};

export default function ManageUsers() {
  return (
    <>
      <DefaultLayout>
        <AddStationForm />
      </DefaultLayout>
    </>
  );
}
