//next-auth-d.ts

import { Role } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: Role;
  isTwoFactorEnabled: boolean;
  createdAt: Date; // Add this line
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    createdAt: Date; // Add this line
  }
}
