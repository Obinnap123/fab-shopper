import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@fabshopper.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminName = process.env.ADMIN_NAME ?? "Fab Shopper Admin";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "SUPER_ADMIN"
    }
  });

  const shippingZones = [
    { locationName: "Standard (Within Lagos)", fee: 4500, description: "Within Lagos" },
    {
      locationName: "South West",
      fee: 6500,
      description: "Ekiti, Osun, Ondo, Ogun, Oyo"
    },
    {
      locationName: "South",
      fee: 7500,
      description: "Akwa Ibom, Bayelsa, Cross River, Delta, Edo, Rivers"
    },
    {
      locationName: "South East",
      fee: 7000,
      description: "Abia, Anambra, Ebonyi, Enugu, Imo"
    },
    { locationName: "Abuja", fee: 7500, description: "Federal Capital Territory" },
    { locationName: "All Northern States", fee: 8000, description: "Northern Nigeria" },
    {
      locationName: "Pick up from store",
      fee: 0,
      description: "Pickup at Fab Shopper HQ",
      isPickup: true,
      isFree: true
    }
  ];

  for (const zone of shippingZones) {
    await prisma.shippingMethod.upsert({
      where: { locationName: zone.locationName },
      update: {
        fee: zone.fee,
        description: zone.description,
        isPickup: zone.isPickup ?? false,
        isFree: zone.isFree ?? zone.fee === 0
      },
      create: {
        locationName: zone.locationName,
        fee: zone.fee,
        description: zone.description,
        isPickup: zone.isPickup ?? false,
        isFree: zone.isFree ?? zone.fee === 0
      }
    });
  }

  await prisma.tax.upsert({
    where: { name: "VAT" },
    update: {
      description: "Value Added Tax",
      percentage: 7.5,
      applyToWebCheckout: true
    },
    create: {
      name: "VAT",
      description: "Value Added Tax",
      percentage: 7.5,
      applyToWebCheckout: true
    }
  });

  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: "Fab Shopper",
      tagline: "Lagos luxury womenswear",
      description: "Bold, editorial fashion crafted in Nigeria.",
      contactPhone: "+234 812 000 0000",
      address: "7B Nduka Osadebay Ajao Estate Lagos, Nigeria",
      lowStockAlert: 3,
      showOutOfStock: true,
      showStockCount: true,
      vatPercentage: 7.5
    }
  });

  const collections = [
    { name: "New Arrivals", slug: "new-arrivals" },
    { name: "Best Sellers", slug: "best-sellers" },
    { name: "Sale", slug: "sale" }
  ];

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: { name: collection.name },
      create: collection
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
