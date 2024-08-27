import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Accounts",
  description: "View your Account Settings",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;

  try {
    session = await auth();
  } catch (error) {
    console.error("Failed to fetch session", error);
  }
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${poppins.className} text-slate-700`}>
          <div className="flex flex-col min-h-screen dark:bg-boxdark-2 dark:text-bodydark">
            <main className="flex-grow">{children}</main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
