"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Validate on the server side
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return Promise.resolve({ error: "invalid Fields!" });
  }

  return Promise.resolve({ success: "Email sent" });
};
