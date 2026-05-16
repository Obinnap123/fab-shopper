import { z } from "zod";

export const addressSchema = z.object({
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().optional().or(z.literal("")),
  state: z.string().trim().optional().or(z.literal("")),
  country: z.string().trim().optional().or(z.literal("")),
  zipCode: z.string().trim().optional().or(z.literal(""))
});

export const accountUpdateSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  phone: z.string().trim().optional().or(z.literal("")),
  instagramHandle: z.string().trim().optional().or(z.literal("")),
  additionalInfo: z.string().trim().max(500, "Additional info is too long").optional().or(z.literal("")),
  subscribedToNewsletter: z.boolean().default(false),
  shippingAddress: addressSchema.nullable()
});

export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
