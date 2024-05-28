"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validate on the server side
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return Promise.resolve({ error: "invalid Fields!" });
  }

  return Promise.resolve({ success: "Email sent" });
};
