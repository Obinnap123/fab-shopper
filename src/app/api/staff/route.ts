import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const staffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["SUPER_ADMIN", "STAFF"]).default("STAFF")
});

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let output = "";
  for (let i = 0; i < 12; i += 1) {
    output += chars[Math.floor(Math.random() * chars.length)];
  }
  return output;
};

export async function GET() {
  const staff = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  return NextResponse.json({ data: staff });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = staffSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.admin.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "Staff email already exists" }, { status: 409 });
  }

  const tempPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  const staff = await prisma.admin.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      password: hashedPassword
    }
  });

  return NextResponse.json({ data: staff, tempPassword }, { status: 201 });
}
