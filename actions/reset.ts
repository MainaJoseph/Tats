"use server";

import * as zod from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const reset = async (values: zod.z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Email" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  //TODO: Generate Token and send Email

  return { success: "Reset Email has been sent" };
};
