"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Socials = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full rounded-md hover:bg-slate-100"
        variant="outline"
        onClick={() => onClick("google")}
        style={{ borderRadius: "10px" }}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>

      <Button
        size="lg"
        className="w-full rounded-md hover:bg-slate-100"
        variant="outline"
        onClick={() => onClick("github")}
        style={{ borderRadius: "10px" }}
      >
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};
