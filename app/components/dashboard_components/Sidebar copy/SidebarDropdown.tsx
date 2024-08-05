import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChildMenuItem {
  label: string;
  route: string;
}

interface SidebarDropdownProps {
  item: ChildMenuItem[];
  compactView: boolean;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  item,
  compactView,
}) => {
  const pathname = usePathname();

  return (
    <>
      <ul
        className={`mb-5.5 mt-4 flex flex-col gap-2.5 ${
          compactView ? "pl-2" : "pl-6"
        }`}
      >
        {item.map((subItem, index) => (
          <li key={index}>
            <Link
              href={subItem.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                pathname === subItem.route ? "text-white text-sm" : ""
              }`}
            >
              {subItem.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
