const isProduction = process.env.NODE_ENV === "production";

const sessionCookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/"
};

export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const CUSTOMER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function createSessionCookieOptions(maxAge: number) {
  return {
    ...sessionCookieBase,
    maxAge
  };
}

export function createExpiredSessionCookieOptions() {
  return {
    ...sessionCookieBase,
    maxAge: 0
  };
}
