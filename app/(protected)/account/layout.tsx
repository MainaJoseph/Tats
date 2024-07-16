// import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
// import { SessionProvider } from "next-auth/react";
// import { auth } from "@/auth";
// import NavBar from "@/app/components/Nav/Nav";

// const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

// export const metadata: Metadata = {
//   title: "Accounts",
//   description: "View your Account Settings",
// };

// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await auth();
//   return (
//     <SessionProvider session={session}>
//       <html lang="en">
//         <body className={`${poppins.className} text-slate-700`}>
//           <div className="flex flex-col min-h-screen">
//             <main className="flex-grow">{children}</main>
//           </div>
//         </body>
//       </html>
//     </SessionProvider>
//   );
// }

"use client";

import Loader from "@/app/components/Loader";
// import "jsvectormap/dist/jsvectormap.css";
// import "flatpickr/dist/flatpickr.min.css";
// import "@/css/satoshi.css";
// import "@/css/style.css";
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
