import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import ClientsClient from "./client-page";

export const metadata: Metadata = {
  title: "View station",
  description: "View and Manage stations here",
};

export default function TatsClients() {
  return (
    <>
      <DefaultLayout>
        <ClientsClient />
      </DefaultLayout>
    </>
  );
}
