import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { customerCookieName, signCustomerToken } from "@/lib/customer-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid login details" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const customer = await prisma.customer.findUnique({ where: { email } });

    if (!customer || !customer.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const passwordOk = await bcrypt.compare(password, customer.password);
    if (!passwordOk) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await signCustomerToken({
      id: customer.id,
      email: customer.email!,
      firstName: customer.firstName,
      lastName: customer.lastName
    });

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

    response.cookies.set({
      name: customerCookieName,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
