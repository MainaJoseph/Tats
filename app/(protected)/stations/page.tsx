import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import StationsClient from "./stations-client";

export const metadata: Metadata = {
  title: "View station",
  description: "View and Manage stations here",
};

export default function AddStations() {
  return (
    <>
      <DefaultLayout>
        <div>
          <StationsClient />
        </div>
      </DefaultLayout>
    </>
  );
}
