import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Children } from "react";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1
        className={cn(
          "text-2xl md:text-3xl font-semibold flex flex-row",
          font.className
        )}
      >
        Tats Authentication{" "}
        <span>
          <Image src="/tats.png" alt="Tats" width={50} height={50} />
        </span>
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
