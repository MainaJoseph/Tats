"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/app/components/Loader";
import { Toaster } from "@/components/ui/toaster";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
      {loading ? <Loader /> : children}
      <Toaster />
    </>
  );
}
