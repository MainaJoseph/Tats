import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { Metadata } from "next";
import TransactionsClient from "./transactions-client";

export const metadata: Metadata = {
  title: "Tats Transactions",
  description: "This is where you can see all of your transactions",
};

export default function TransactionPage() {
  return (
    <>
      <DefaultLayout>
        <TransactionsClient />
      </DefaultLayout>
    </>
  );
}
