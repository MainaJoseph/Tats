// "use client";

// import React, { useEffect, useState } from "react";
// import Loader from "@/app/components/Loader";
// import { Toaster } from "@/components/ui/toaster";

// interface ClientWrapperProps {
//   children: React.ReactNode;
// }

// export default function ClientWrapper({ children }: ClientWrapperProps) {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {loading ? <Loader /> : children}
//       <Toaster />
//     </>
//   );
// }
