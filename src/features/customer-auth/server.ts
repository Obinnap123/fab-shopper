import bcrypt from "bcryptjs";
import type { Customer } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  customerCookieName,
  createCustomerSessionToken,
  toCustomerSession
} from "@/lib/customer-auth";
import {
  createSessionCookieOptions,
  CUSTOMER_SESSION_MAX_AGE_SECONDS
} from "@/lib/session-cookie";
import type { LoginInput, RegisterInput } from "@/features/customer-auth/schemas";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type AuthCustomer = Pick<Customer, "id" | "firstName" | "lastName" | "email" | "password" | "welcomeEmailSent">;

export async function findCustomerByEmail(email: string) {
  return prisma.customer.findUnique({
    where: { email: normalizeEmail(email) }
  });
}

export async function registerCustomer(input: RegisterInput): Promise<AuthCustomer> {
  const email = normalizeEmail(input.email);
  const existing = await findCustomerByEmail(email);

  if (existing && !existing.deletedAt) {
    throw new Error("Email is already registered");
  }

  if (existing?.deletedAt) {
    throw new Error("An account with this email was previously closed. Please contact support to restore it.");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  return prisma.customer.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      welcomeEmailSent: true
    }
  });
}

export async function authenticateCustomer(input: LoginInput): Promise<AuthCustomer | null> {
  const customer = await findCustomerByEmail(input.email);

  if (!customer?.password || customer.deletedAt) {
    return null;
  }

  const passwordOk = await bcrypt.compare(input.password, customer.password);
  if (!passwordOk) {
    return null;
  }

  return customer;
}

export async function createCustomerAuthResponse(customer: AuthCustomer, message: string, status: number) {
  const token = await createCustomerSessionToken(toCustomerSession(customer));
  const response = NextResponse.json({ message }, { status });

  response.cookies.set({
    name: customerCookieName,
    value: token,
    ...createSessionCookieOptions(CUSTOMER_SESSION_MAX_AGE_SECONDS)
  });

  return response;
}
