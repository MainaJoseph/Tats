import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import ChartsPage from "./chart_page";

export const metadata: Metadata = {
  title: "View station",
  description: "View and Manage stations here",
};

export default function TatsClients() {
  return (
    <>
      <DefaultLayout>
        <ChartsPage />
      </DefaultLayout>
    </>
  );
}
