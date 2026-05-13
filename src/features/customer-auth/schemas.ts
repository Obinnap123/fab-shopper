import { z } from "zod";

const trimmedString = z.string().trim();

export const registerSchema = z.object({
  firstName: trimmedString.min(2, "First name must be at least 2 characters"),
  lastName: trimmedString.min(2, "Last name must be at least 2 characters"),
  email: trimmedString.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
  email: trimmedString.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
