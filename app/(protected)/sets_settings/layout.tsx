"use client";

import Loader from "@/app/components/Loader";
import { SidebarColorProvider } from "@/context/SidebarColorContext";
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
    <SidebarColorProvider>
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <SidebarColorProvider>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              {loading ? <Loader /> : children}
              <Toaster />
            </div>
          </SidebarColorProvider>
        </body>
      </html>
    </SidebarColorProvider>
  );
}
