"use client";

import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { IoMenuSharp } from "react-icons/io5";
import AvatarClient from "../../avatar/AvatarClient";
import { Redressed } from "next/font/google";
import { FaArrowDown } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { SheetSide } from "../../reports_components/report-sheet";

import { useState, useEffect } from "react"; // Import useState and useEffect hooks
import CommandDialogue from "./command-dialogue";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false); // State to control command dialogue

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

  return (
    <header className="sticky top-0 flex w-full bg-white drop-shadow-1 z-30">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <IoMenuSharp size={25} />
          </button>
          {/* Hamburger Toggle BTN */}

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

        <div className="hidden sm:block">
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2"
              onClick={() => setIsCommandOpen(true)} // Open command dialogue
            >
              <svg
                className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill=""
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
              onFocus={() => setIsCommandOpen(true)} // Open command dialogue on focus
            />
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Notification Menu Area */}
            <DropdownNotification />
            {/* Notification Menu Area */}

            {/* Chat Notification Area */}
            <DropdownMessage />
            {/* Chat Notification Area */}
          </ul>
          <SheetSide /> {/* Add the SheetSide component here */}
          {/* User Area */}
          <AvatarClient />
          {/* User Area */}
        </div>
      </div>
      <CommandDialogue open={isCommandOpen} onOpenChange={setIsCommandOpen} />{" "}
      {/* Render command dialogue */}
    </header>
  );
};

export default Header;
