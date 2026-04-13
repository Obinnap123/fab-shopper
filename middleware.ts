import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName, verifyAdminToken } from "@/lib/auth";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(adminCookieName)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await verifyAdminToken(token);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (requiresAdminApiAuth(request)) {
    const token = request.cookies.get(adminCookieName)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await verifyAdminToken(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
};
