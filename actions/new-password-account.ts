"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "@/schemas";
import { db } from "@/lib/db";
import { sendPasswordChangeEmail } from "@/lib/mail";

export const newPasswordAccount = async (
  values: z.infer<typeof NewPasswordSchema>,
  userId: string
) => {
  // Validate the password fields
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { password } = validatedFields.data;

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the password for the logged-in user
  const user = await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
    select: { email: true },
  });

  // Check if the user's email is not null
  if (user.email) {
    // Send email to notify the user about the password change
    await sendPasswordChangeEmail(user.email);
  }

  // Return success message
  return { success: "Password Updated" };
};
