import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item, compactView }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul
        className={`mb-5.5 mt-4 flex flex-col gap-2.5 ${
          compactView ? "pl-2" : "pl-6"
        }`}
      >
        {item.map((subItem: any, index: number) => (
          <li key={index}>
            <Link
              href={subItem.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                pathname === subItem.route ? "text-white" : ""
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
