"use client";

export type CustomerSession = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  unreadNotifications: number;
} | null;

export const customerSessionQueryKey = ["customer-session"] as const;

export async function fetchCustomerSession() {
  const res = await fetch("/api/customer-auth/session", {
    cache: "no-store",
    credentials: "same-origin"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch customer session");
  }

  const json = await res.json();
  return json.data as CustomerSession;
}
