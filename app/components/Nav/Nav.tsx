"use client";

import Link from "next/link";
import { Redressed } from "next/font/google";
import { FcEngineering } from "react-icons/fc";
import { IoMenu } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { useState } from "react";
import Container from "../Container";
import { NavMenu } from "./NavMenu";
import Search from "../search/Search";
import Image from "next/image";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="sticky top-0 w-full bg-white z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link
              href="/"
              className={`${redressed.className} font-bold text-3xl flex flex-row`}
            >
              Tats
              <span className="mt-0">
                <Image src="/tats.png" alt="Tats" width={50} height={50} />
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <NavMenu />
              <Search />
              <Link
                href="/auth/login"
                className="px-4 py-2 border rounded-full"
              >
                Log in
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-4 py-2 bg-black text-white rounded-full hover:opacity-50"
              >
                Sign up
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-4 w-full">
              <Search />
              <button onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                  <IoMdCloseCircle size={24} />
                ) : (
                  <IoMenu size={24} />
                )}
              </button>
            </div>
          </div>
        </Container>
        {isMobileMenuOpen && (
          <div className="md:hidden p-4">
            <NavMenu />
            <div className="mt-4 flex flex-col space-y-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 border rounded-full text-center"
              >
                Log in
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-4 py-2 bg-black text-white rounded-full text-center"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
