"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IoMdArrowDropdown } from "react-icons/io";
import Image from "next/image";

export function SheetSide() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="hidden md:flex flex-row gap-1 items-center cursor-pointer">
          <p className="text-slate-900 font-semibold">Reports</p>
          <IoMdArrowDropdown className="mt-1" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="bg-white text-slate-800">
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center font-bold">
            <Image src="/tats.png" alt="Tats" width={40} height={40} />
            Tats Report
          </SheetTitle>
          <SheetDescription className="font-semibold">
            Explore our Latest & Advanced Reporting tool
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h2 className="font-bold text-lg mb-2">General Report</h2>
              <ul className="list-disc list-inside cursor-pointer">
                <li className="hover:underline">Transactions Reports</li>
                <li className="hover:underline">Statistics</li>
                <li className="hover:underline">Overview</li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">Detailed Reports</h2>
              <ul className="list-disc list-inside cursor-pointer">
                <li className="hover:underline">Transactions Reports V2</li>
                <li className="hover:underline">Inventory Report</li>
                <li className="hover:underline">Performance Report</li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">Station Report</h2>
              <ul className="list-disc list-inside cursor-pointer">
                <li className="hover:underline">Station 1</li>
                <li className="hover:underline">Station 2</li>
                <li className="hover:underline">Station 3</li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">Client Report</h2>
              <ul className="list-disc list-inside cursor-pointer">
                <li className="hover:underline">Client 1</li>
                <li className="hover:underline">Client 2</li>
                <li className="hover:underline">Client 3</li>
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
