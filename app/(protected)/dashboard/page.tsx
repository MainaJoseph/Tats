import Dashy from "@/app/components/dashboard_components/Dashboard/dash-comp";
import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tats dashboard",
  description: "This is where you can configurethe Tats settings",
};

export default function SettingsPage() {
  return (
    <>
      <DefaultLayout>
        <Dashy />
      </DefaultLayout>
    </>
  );
}
