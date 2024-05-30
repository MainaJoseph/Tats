"use server";

import * as z from "zod";
import bycrypt from "bcrypt";
import { db } from "@/lib/db";

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validate on the server side
  const validatedFields = RegisterSchema.safeParse(values);

  // Validating the data from Register schema
  if (!validatedFields.success) {
    return Promise.resolve({ error: "invalid Fields!" });
  }

  const { email, password, name } = validatedFields.data;

  // Hashing the password
  const hashedPassword = await bycrypt.hash(password, 10);

  //Checking if the email exists
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  //Create user
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //TO DO: Send verification Token Email

  return { success: "User Created" };
};
