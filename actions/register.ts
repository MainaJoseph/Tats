"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    // Validate on the server side
    const validatedFields = RegisterSchema.safeParse(values);

    // Validating the data from Register schema
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, password, name } = validatedFields.data;

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Checking if the email exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    // Create user
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // TO DO: Send verification Token Email

    return { success: "User created" };
  } catch (error) {
    console.error("Error during user registration:", error);
    return {
      error: "An error occurred during registration. Please try again later.",
    };
  }
};
