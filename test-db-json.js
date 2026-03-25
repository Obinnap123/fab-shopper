const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const prisma = new PrismaClient();

async function check() {
  const admins = await prisma.admin.findMany();
  let output = [];
  for (const admin of admins) {
    const isMatch = await bcrypt.compare("password123", admin.password);
    output.push({
      email: admin.email,
      role: admin.role,
      hashedPassword: admin.password,
      password123Matches: isMatch
    });
  }
  fs.writeFileSync("db-out.json", JSON.stringify(output, null, 2), "utf-8");
}

check().catch(console.error).finally(() => prisma.$disconnect());
