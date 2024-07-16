import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import NavBar from "@/app/components/Nav/Nav";
import ClientWrapper from "./ClientWrapper";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Accounts",
  description: "View your Account Settings",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          suppressHydrationWarning={true}
          className={`${poppins.className} text-slate-700`}
        >
          <div className="flex flex-col min-h-screen dark:bg-boxdark-2 dark:text-bodydark">
            <main className="flex-grow">
              <ClientWrapper>{children}</ClientWrapper>
            </main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
