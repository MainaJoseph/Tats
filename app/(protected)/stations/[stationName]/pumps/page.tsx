import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import PumpsPageClient from "./pumps-page-client";

export const metadata: Metadata = {
  title: "View station",
  description: "View and Manage stations here",
};

export default function PumpsPage() {
  return (
    <>
      <DefaultLayout>
        <div>
          <PumpsPageClient />
        </div>
      </DefaultLayout>
    </>
  );
}
