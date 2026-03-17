import { SignJWT, jwtVerify } from "jose";
import { requiredEnv } from "@/lib/env";

const secret = new TextEncoder().encode(requiredEnv("NEXTAUTH_SECRET"));

export const adminCookieName = "fabshopper_admin";

export type AdminTokenPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as AdminTokenPayload;
}
