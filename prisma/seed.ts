import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Collections...");
  const collections = [
    { name: "New Arrivals", slug: "new-arrivals" },
    { name: "Women's Shoes", slug: "womens-shoes" },
    { name: "Men's Shoes", slug: "mens-shoes" },
    { name: "Bags & Purses", slug: "bags" },
    { name: "Clothing", slug: "clothing" },
    { name: "Perfumes", slug: "perfumes" },
    { name: "Accessories", slug: "accessories" },
  ];

  for (const collection of collections) {
    const exists = await prisma.collection.findUnique({ where: { slug: collection.slug } });
    if (!exists) {
      await prisma.collection.create({ data: collection });
      console.log(`Created collection: ${collection.name}`);
    }
  }

  console.log("Seeding Super Admin...");
  const adminEmail = "admin@fabshopper.com";
  const exists = await prisma.admin.findUnique({ where: { email: adminEmail } });
  
  if (!exists) {
    const hashedPassword = await bcrypt.hash("password123", 12);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Super Admin",
        role: "SUPER_ADMIN"
      }
    });
    console.log("Created Super Admin: admin@fabshopper.com / password123");
  } else {
    await prisma.admin.update({
      where: { email: adminEmail },
      data: { role: "SUPER_ADMIN" }
    });
    console.log("Super Admin already exists. Ensured role is SUPER_ADMIN.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
