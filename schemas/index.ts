import * as z from "zod";
import { Role } from "@prisma/client";

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Set the error path to confirmPassword
  });

export const ResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const SettingSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  // role: z.enum([Role.ADMIN, Role.USER]),
  email: z.optional(z.string().email()),
});

// New StationSchema
export const StationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  nozzleIdentifierName: z.enum(["pumpAddress", "nozzle"], {
    required_error: "Nozzle Identifier Name is required",
  }),
});

export type StationData = z.infer<typeof StationSchema>;

//New ClientSchema
export const ClientSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  allowedscope: z.string().optional(),
});

export type ClientData = z.infer<typeof ClientSchema>;

// New AddPumpSchema
export const AddPumpSchema = z.object({
  label: z.string().min(1, { message: "Pump label is required" }),
  rdgIndex: z
    .number()
    .int()
    .positive({ message: "RDG index must be a positive integer" }),
  nozzles: z
    .array(
      z.object({
        id: z.string().min(1, { message: "Nozzle ID is required" }),
        label: z.string().min(1, { message: "Nozzle label is required" }),
      })
    )
    .min(1, { message: "At least one nozzle is required" }),
});

export type AddPumpData = z.infer<typeof AddPumpSchema>;

//RemapPumpSchema
export const RemapPumpSchema = z.object({
  label: z.string().min(1, { message: "Pump label is required" }),
  rdgIndex: z.string().min(1, { message: "RDG index is required" }),
  nozzles: z
    .array(
      z.object({
        id: z.string().min(1, { message: "Nozzle ID is required" }),
        label: z.string().min(1, { message: "Nozzle label is required" }),
      })
    )
    .min(1, { message: "At least one nozzle is required" }),
});

export type RemapPumpData = z.infer<typeof RemapPumpSchema>;

// Update Client Details Schema
export const UpdateClientDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  allowedscope: z.string().optional(),
});

export type UpdateClientDetailsData = z.infer<typeof UpdateClientDetailsSchema>;

// Update Station Details Schema
export const EditStationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  nozzleIdentifierName: z.enum(["pumpAddress", "nozzle"], {
    required_error: "Nozzle Identifier Name is required",
  }),
});

export type EditStationData = z.infer<typeof EditStationSchema>;
