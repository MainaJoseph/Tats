"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

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

    const verificationToken = await generateVerificationToken(email);

    // Send verification Token Email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation Email Sent" };
  } catch (error) {
    console.error("Error during user registration:", error);
    return {
      error: "An error occurred during registration. Please try again later.",
    };
  }
};
