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
import { useCurrentUser } from "@/hooks/use-current-user";
import { IoMenuSharp } from "react-icons/io5";
import { AiOutlineDash } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { CiViewTable, CiLogin, CiSettings } from "react-icons/ci";
import { FaChartPie } from "react-icons/fa6";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { FaPeopleRoof } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";

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
        icon: <FaPeopleRoof className="text-white" size={22} />,
        label: "Clients",
        route: "/clients",
      },

      {
        icon: <MdFormatListBulletedAdd className="text-white" size={22} />,
        label: "Manage Stations",
        route: "#",
        children: [
          { label: "Stations", route: "/stations" },
          { label: "Add stations", route: "/add_stations" },
        ],
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
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        icon: <FaChartPie className="text-white" size={20} />,
        label: "Chart",
        route: "/charts",
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
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [compactView, setCompactView] = useLocalStorage("compactView", true);
  const pathname = usePathname();
  const user = useCurrentUser();
  const formattedDate = user?.createdAt
    ? format(new Date(user.createdAt), "MMM yyyy")
    : "";

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const handleItemClick = () => {
    setSidebarOpen(false);
  };

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-10 flex h-screen ${
          compactView ? "md:w-20" : "w-76"
        } flex-col overflow-hidden overflow-x-hidden bg-slate-800 text-white duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onMouseEnter={() => setCompactView(false)}
        onMouseLeave={() => setCompactView(true)}
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
                <p
                  className={`${redressed.className} font-bold text-xl flex items-center`}
                >
                  Tats
                </p>
              ) : (
                <HiMenuAlt3 size={25} />
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

        <div className="flex-grow overflow-y-auto">
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

        {/* <Link
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
        </Link> */}
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
