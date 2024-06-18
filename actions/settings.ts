"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { SettingSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";

export const settings = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser();

  // Check if user exists
  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  // Check if user exists in db
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized..." };
  }

  //Don't allow OAuth Clients to change email and 2factor verification
  if (user.isOAuth) {
    values.email = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  //check if email exists
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Emali already in use!" };
    }
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  });

  return { success: "Settings Updated" };
};
