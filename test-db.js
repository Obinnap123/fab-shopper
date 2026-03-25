const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function check() {
  console.log("Checking DB directly via Prisma...");
  const admins = await prisma.admin.findMany();
  console.log("Total admins in DB:", admins.length);
  
  for (const admin of admins) {
    console.log("-------------------");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Hashed Password:", admin.password);
    
    const isMatch = await bcrypt.compare("password123", admin.password);
    console.log("Does 'password123' match?", isMatch);
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
