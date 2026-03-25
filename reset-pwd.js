const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function reset() {
  console.log("Resetting admin password to 'password123'...");
  const hashedPassword = await bcrypt.hash("password123", 12);
  
  await prisma.admin.update({
    where: { email: "admin@fabshopper.com" },
    data: { password: hashedPassword }
  });
  
  console.log("Successfully reset password for admin@fabshopper.com");
}

reset()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
