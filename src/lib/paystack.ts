import { requiredEnv } from "@/lib/env";

export function getPaystackSecretKey() {
  return requiredEnv("PAYSTACK_SECRET_KEY");
}

export function getPaystackPublicKey() {
  return requiredEnv("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY");
}

export function getPaystackWebhookSecret() {
  return requiredEnv("PAYSTACK_WEBHOOK_SECRET");
}
