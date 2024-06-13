//auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/authConfig";
import { getUserById } from "./data/user";
import { db } from "./lib/db";
import { Role } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log({
        user,
        account,
      });
      //Allow OAUTH withot email verification
      if (account?.provider !== "credentials") return true;

      // Ensure user.id is defined
      if (!user.id) return false; // Added check for undefined user.id

      //get exsiting user
      const existingUser = await getUserById(user.id);

      //check if user is verified. prevent signin without verification
      if (!existingUser?.emailVerified) return false;

      //Check if there is 2FA
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        //If there is no factor confirmation Return false
        if (!twoFactorConfirmation) return false;

        //Delete two factor Confirmatiion for the next signIn
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    async session({ token, session }) {
      console.log({
        sessionToken: token,
      });

      // Ensure token.sub and session.user are defined before assignment
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // Ensure token.role and session.user are defined before assignment
      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      // Ensure token.isTwoFactorEnabled and session.user are defined before assignment
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.createdAt = token.createdAt as Date; // Add this line
      }

      return session;
    },

    async jwt({ token }) {
      // Check if token.sub is defined before proceeding
      if (!token.sub) return token; // Added check for undefined token.sub

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token; // Added check to ensure existingUser is found

      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.createdAt = existingUser.createdAt;

      console.log("JWT Token:", token); // Console Log Created At

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
