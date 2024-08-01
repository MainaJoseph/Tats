"use client";

import Link from "next/link";
import { Redressed } from "next/font/google";
import { IoMenu } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { useState } from "react";
import Container from "../Container";
import { NavMenu } from "./NavMenu";
import Search from "../search/Search";
import Image from "next/image";
import { LuLogOut } from "react-icons/lu";
import { signOut } from "next-auth/react"; // Import the signOut function

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AvatarClient from "../avatar/AvatarClient";
import { useCurrentUser } from "@/hooks/use-current-user";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useCurrentUser();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleReloadHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="sticky top-0 w-full bg-white z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link
              href="/"
              onClick={handleReloadHome}
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
              {isAuthenticated ? (
                <>
                  <AvatarClient />
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <LuLogOut className="hover:text-rose-400" size={22} />{" "}
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className="bg-white text-slate-900"
                      style={{ borderRadius: "5px" }}
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure you want to logout?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You do not worry you can login at any point and resume
                          where you left at.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="bg-rose-500 text-white hover:bg-rose-300"
                          style={{ borderRadius: "5px" }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-slate-900 text-white hover:bg-slate-600"
                          style={{ borderRadius: "5px" }}
                          onClick={() => signOut()}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 border rounded-full hover:border-sky-500"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="px-4 py-2 bg-slate-800 text-white rounded-full hover:opacity-50"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden flex items-center gap-4 w-full">
              <Search />
              {isAuthenticated && (
                <>
                  <AvatarClient />

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <LuLogOut className="hover:text-rose-400" size={22} />{" "}
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className="bg-white text-slate-900"
                      style={{ borderRadius: "5px" }}
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure you want to logout?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You do not worry you can login at any point and resume
                          where you left at.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="bg-rose-500 text-white hover:bg-rose-300"
                          style={{ borderRadius: "5px" }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-slate-900 text-white hover:bg-slate-600"
                          style={{ borderRadius: "5px" }}
                          onClick={() => signOut()}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
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
              {!isAuthenticated && (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
