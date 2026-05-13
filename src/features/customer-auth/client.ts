import type { LoginInput, RegisterInput } from "@/features/customer-auth/schemas";
import { fetchJson } from "@/lib/fetch-json";

type AuthSuccessResponse = {
  message: string;
};

export function registerCustomerRequest(values: RegisterInput) {
  return fetchJson<AuthSuccessResponse>("/api/customer-auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values)
  });
}

export function loginCustomerRequest(values: LoginInput) {
  return fetchJson<AuthSuccessResponse>("/api/customer-auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values)
  });
}
