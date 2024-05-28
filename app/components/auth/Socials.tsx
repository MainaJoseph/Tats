"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const Socials = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full rounded-md hover:bg-slate-100"
        variant="outline"
        onClick={() => {}}
        style={{ borderRadius: "10px" }}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>

      <Button
        size="lg"
        className="w-full rounded-md hover:bg-slate-100"
        variant="outline"
        onClick={() => {}}
        style={{ borderRadius: "10px" }}
      >
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};
