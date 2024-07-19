"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoMenuSharp } from "react-icons/io5";
import { Redressed } from "next/font/google";
import AvatarClient from "../../avatar/AvatarClient";
import { SheetSide } from "../../reports_components/report-sheet";
import CommandDialogue from "./command-dialogue";
import BreadcrumbComponent from "../../breed-crumb";
import { useParams, usePathname } from "next/navigation"; // Import usePathname

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const pathname = usePathname(); // Use usePathname to get the current route
  const params = useParams(); // Use useParams to get the stationName

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Example pages for breadcrumb (replace with your actual page data)
  const pages = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Detailed Transaction", href: "/transaction_report_v2" },
    { name: "Manage Stations", href: "/stations" },
    { name: "Add Stations", href: "/add_stations" },
    { name: "Account Profile", href: "/account" },
    { name: "Pumps", href: `/stations/${params.stationName}/pumps` },
    {
      name: `Station: ${params.stationName}`,
      href: `/stations/${params.stationName}`,
    },
  ];

  // Determine the current page name based on the route
  const currentPage = pages.find((page) => page.href === pathname);
  const breadcrumbPages = [
    { name: "Home", href: "/dashboard" },
    ...(currentPage ? [currentPage] : []),
  ];

  return (
    <header className="sticky top-0 flex w-full bg-white drop-shadow-1 z-30">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <IoMenuSharp size={25} />
          </button>

          <div className="flex flex-row gap-2">
            <Link
              href="/dashboard"
              className={`${redressed.className} font-bold text-3xl flex flex-row text-slate-950`}
            >
              <span className="mt-0">
                <Image src="/tats.png" alt="Tats" width={50} height={50} />
              </span>
              Tats
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center flex-grow">
          <div className="relative flex-shrink-0 w-64">
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none"
              onFocus={() => setIsCommandOpen(true)}
            />
          </div>
          <div className="lg:ml-20 xl:ml-52 flex-grow">
            <BreadcrumbComponent pages={breadcrumbPages} />
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <SheetSide />
          <AvatarClient />
        </div>
      </div>
      <CommandDialogue open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </header>
  );
};

export default Header;
