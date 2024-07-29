import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import ClientStations from "./client-stations";

export const metadata: Metadata = {
  title: "View Client station",
  description: "View and Manage stations here",
};

export default function PumpsPage() {
  return (
    <>
      <DefaultLayout>
        <div>
          <ClientStations />
        </div>
      </DefaultLayout>
    </>
  );
}
