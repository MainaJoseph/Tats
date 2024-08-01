import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SidebarDropdown from "./SidebarDropdown";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route: string;
  children?: ChildMenuItem[];
}

interface ChildMenuItem {
  label: string;
  route: string;
}

interface SidebarItemProps {
  item: MenuItem;
  pageName: string;
  setPageName: (name: string) => void;
  onClick: () => void;
  compactView: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  pageName,
  setPageName,
  onClick,
  compactView,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(updatedPageName);
    onClick();
    if (item.route && item.route !== "#") {
      router.push(item.route);
    }
  };

  const isActive = (item: MenuItem): boolean => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child) => child.route === pathname);
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <li className="relative">
      {item.route && item.route !== "#" ? (
        <Link href={item.route} passHref>
          <div
            onClick={handleClick}
            className={`${
              isItemActive ? "bg-slate-500 rounded-[11px] dark:bg-meta-4" : ""
            } group flex items-center ${
              compactView ? "justify-center" : "gap-2.5"
            } rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 cursor-pointer`}
          >
            <span className="flex items-center">{item.icon}</span>
            {!compactView && <span>{item.label}</span>}
            {item.children && !compactView && (
              <svg
                className={`ml-auto fill-current ${
                  pageName === item.label.toLowerCase() && "rotate-180"
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                  fill=""
                />
              </svg>
            )}
          </div>
        </Link>
      ) : (
        <div
          onClick={handleClick}
          className={`${
            isItemActive ? "bg-slate-500 rounded-[11px] dark:bg-meta-4" : ""
          } group flex items-center ${
            compactView ? "justify-center" : "gap-2.5"
          } rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 cursor-pointer`}
        >
          <span className="flex items-center">{item.icon}</span>
          {!compactView && <span>{item.label}</span>}
          {item.children && !compactView && (
            <svg
              className={`ml-auto fill-current ${
                pageName === item.label.toLowerCase() && "rotate-180"
              }`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                fill=""
              />
            </svg>
          )}
        </div>
      )}

      {item.children && !compactView && (
        <div
          className={`translate transform overflow-hidden ${
            pageName !== item.label.toLowerCase() && "hidden"
          }`}
        >
          <SidebarDropdown item={item.children} compactView={compactView} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
