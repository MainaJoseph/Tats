"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  // check if token exists
  if (!token) {
    return { error: "Missing token!" };
  }

  //check if the password fields are validated
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" }; // Correct return statement
  }

  const { password } = validatedFields.data;

  //check if there is an existing token
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid Fields" };
  }

  //check  if the existing token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  //Check if the user exists
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exists" };
  }

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Update the hashed password
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  //Delete Existing hashed password
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  //return success that password has updated
  return { success: "Password Updated" };
};
