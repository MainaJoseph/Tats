"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import useLocalStorage from "@/hooks/useLocalStorage";
import SidebarItem from "./SidebarItem";
import ClickOutside from "../ClickOutside";
import { Redressed } from "next/font/google";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { IoMenuSharp } from "react-icons/io5";
import { AiOutlineDash } from "react-icons/ai";
import { ImShrink } from "react-icons/im";
import { CgArrowsShrinkH } from "react-icons/cg";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { CiViewTable, CiLogin, CiSettings } from "react-icons/ci";
import { FaChartPie } from "react-icons/fa6";
import {
  MdOutlineCalendarMonth,
  MdFormatListBulletedAdd,
} from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <MdOutlineDashboardCustomize size={24} className="text-white" />,
        label: "Dashboard",
        route: "/dashboard",
      },
      {
        icon: <CiViewTable className="text-white" size={24} />,
        label: "Transactions",
        route: "#",
        children: [
          { label: "Transactions", route: "/transactions" },
          { label: "Detailed Transactions", route: "/transaction_report_v2" },
        ],
      },
      {
        icon: <MdOutlineCalendarMonth className="text-white" size={22} />,
        label: "Calendar",
        route: "/calendar",
      },
      {
        icon: <IoMdPersonAdd className="text-white" size={22} />,
        label: "Profile",
        route: "/profile",
      },
      {
        icon: <MdFormatListBulletedAdd className="text-white" size={22} />,
        label: "Forms",
        route: "#",
        children: [
          { label: "Form Elements", route: "/forms/form-elements" },
          { label: "Form Layout", route: "/forms/form-layout" },
        ],
      },
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        icon: <FaChartPie className="text-white" size={20} />,
        label: "Chart",
        route: "/chart",
      },
      {
        icon: <CiSettings className="text-white" size={25} />,
        label: "Settings",
        route: "#",
        children: [
          { label: "Manage Users", route: "/manage_users" },
          { label: "Company Settings", route: "/ui/buttons" },
        ],
      },
      {
        icon: <CiLogin className="text-white" size={22} />,
        label: "Authentication",
        route: "#",
        children: [
          { label: "Sign In", route: "/auth/signin" },
          { label: "Sign Up", route: "/auth/signup" },
        ],
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [compactView, setCompactView] = useLocalStorage("compactView", false);
  const pathname = usePathname(); // Hook to get the current path

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "h") {
        event.preventDefault();
        setCompactView(!compactView);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [compactView, setCompactView]);

  useEffect(() => {
    setSidebarOpen(false); // Close sidebar on route change
  }, [pathname, setSidebarOpen]);

  const handleItemClick = () => {
    setSidebarOpen(false);
  };

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const user = useCurrentUser();
  const formattedDate = user?.createdAt
    ? format(new Date(user.createdAt), "MMM yyyy")
    : "";

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-10 flex h-screen ${
          compactView ? "w-20" : "w-64"
        } flex-col overflow-y-hidden bg-slate-800 text-white duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 mt-2 md:mt-4">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`${redressed.className} font-bold text-3xl flex items-center`}
            >
              <Image src="/tatswhite.png" alt="Tats" width={50} height={50} />
              {!compactView && <span className="ml-2">Tats</span>}
            </Link>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCompactView(!compactView)}
              aria-controls="sidebar"
              className="hidden lg:block"
            >
              {compactView ? (
                <CgArrowsShrinkH size={25} />
              ) : (
                <ImShrink size={17} />
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              className="block lg:hidden"
            >
              <IoMenuSharp size={25} />
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {!compactView && (
                  <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                    {group.name}
                  </h3>
                )}
                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                      onClick={handleItemClick}
                      compactView={compactView}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <a
          href="/account"
          className="absolute bottom-0 left-0 w-full p-4 cursor-pointer"
        >
          {!compactView ? (
            <div className="flex flex-col gap-1 mt-1 mb-1 shadow-md">
              <div className="ml-2 mr-2">
                <div className="flex flex-row justify-between items-start">
                  <div className="flex flex-col">
                    <div className="text-white font-semibold text-md">
                      {user?.name}
                    </div>
                    <div className="text-white font-normal text-sm">
                      {user?.email}
                    </div>
                  </div>
                  <div className="text-white ml-1">
                    <AiOutlineDash className="font-bold text-white mr-2" />
                  </div>
                </div>
                <div className="flex flex-row gap-1 text-white font-normal text-xs mt-4">
                  <FaRegCalendarAlt />
                  <span> Joined on :</span>
                  <span className="font-semibold">{formattedDate}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <RxAvatar size={24} className="text-white" />
            </div>
          )}
        </a>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
