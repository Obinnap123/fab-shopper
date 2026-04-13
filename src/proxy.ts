import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const adminCookieName = "fabshopper_admin";

const isAuthenticatedAdmin = async (request: NextRequest) => {
  const token = request.cookies.get(adminCookieName)?.value;
  const secret = process.env.NEXTAUTH_SECRET;

  if (!token || !secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
};

const requiresAdminApiAuth = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  if (pathname.startsWith("/api/orders")) return true;
  if (pathname.startsWith("/api/customers")) return true;
  if (pathname.startsWith("/api/shipping")) return true;
  if (pathname.startsWith("/api/staff")) return true;

  if (pathname.startsWith("/api/products") && method !== "GET") return true;
  if (pathname.startsWith("/api/collections") && method !== "GET") return true;

  return false;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const isAuthed = await isAuthenticatedAdmin(request);
    if (!isAuthed) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (requiresAdminApiAuth(request)) {
    const isAuthed = await isAuthenticatedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
};

