import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import NavBar from "./components/Nav/Nav";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Tats",
  description: "Tats",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${poppins.className} text-slate-700`}>
          <main>{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
