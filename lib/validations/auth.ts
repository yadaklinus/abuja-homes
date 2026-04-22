import { z } from "zod"

export const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z.string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .max(128),
  displayName: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^0[789][01]\d{8}$/, "Enter valid Nigerian phone (e.g. 08012345678)"),
  role: z.enum(["TENANT", "LANDLORD"]),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
