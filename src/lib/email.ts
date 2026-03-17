import { Resend } from "resend";
import { requiredEnv } from "@/lib/env";

export const resend = new Resend(requiredEnv("RESEND_API_KEY"));

export function getFromEmail() {
  return requiredEnv("FROM_EMAIL");
}
