import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import ManageReports from "./ManageReports";

export const metadata: Metadata = {
  title: "Tats Transactions Detailed Report",
  description: "This is where you can see all of your transactions reports",
};

export default function TransactionReportV2Page() {
  return (
    <>
      <DefaultLayout>
        <div>
          <ManageReports />
        </div>
      </DefaultLayout>
    </>
  );
}
