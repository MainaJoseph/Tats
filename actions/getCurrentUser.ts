import { db } from "@/lib/db";
import { getSession } from "next-auth/react";
import { SafeUser } from "@/types"; // Adjust the path according to your project structure

export const getCurrentUser = async (): Promise<SafeUser | null> => {
  try {
    const session = await getSession();
    console.log("Session:", session); // Debug: Log the session

    if (!session || !session.user || !session.user.email) {
      console.warn("No session or user email found"); // Debug: Log a warning if session or email is missing
      return null;
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (user) {
      const safeUser: SafeUser = {
        ...user,
        createdAt: user.createdAt ? user.createdAt.toISOString() : "",
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : "",
        emailVerified: user.emailVerified
          ? user.emailVerified.toISOString()
          : null,
      };

      console.log("User found:", safeUser); // Debug: Log the found user
      return safeUser;
    } else {
      console.warn("User not found in the database"); // Debug: Log if user not found in DB
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error); // Debug: Log any error
    return null;
  }
};
