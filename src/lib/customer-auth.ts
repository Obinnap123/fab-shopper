import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const customerCookieName = "fab_customer_session";
const secretKey = process.env.JWT_SECRET || "fallback_secret_for_development";
const key = new TextEncoder().encode(secretKey);

export type CustomerSession = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export async function signCustomerToken(payload: CustomerSession) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key);
}

export async function verifyCustomerToken(
  token: string
): Promise<CustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as CustomerSession;
  } catch (error) {
    return null;
  }
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(customerCookieName)?.value;
  if (!token) return null;

  return await verifyCustomerToken(token);
}
