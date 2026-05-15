import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getOrderLinkFromReferenceKey(referenceKey: string | null) {
  if (!referenceKey) {
    return null;
  }

  if (referenceKey.startsWith("order-created-")) {
    const orderId = referenceKey.slice("order-created-".length).trim();
    return orderId ? `/order-confirmation/${orderId}` : null;
  }

  return null;
}

async function main() {
  const notifications = await prisma.customerNotification.findMany({
    where: {
      link: "/account"
    },
    select: {
      id: true,
      referenceKey: true
    }
  });

  let updatedCount = 0;
  let skippedCount = 0;

  for (const notification of notifications) {
    const directLink = getOrderLinkFromReferenceKey(notification.referenceKey);

    if (directLink) {
      await prisma.customerNotification.update({
        where: { id: notification.id },
        data: { link: directLink }
      });
      updatedCount += 1;
      continue;
    }

    if (notification.referenceKey?.startsWith("payment-confirmed-")) {
      const orderNumber = notification.referenceKey.slice("payment-confirmed-".length).trim();

      if (!orderNumber) {
        skippedCount += 1;
        continue;
      }

      const order = await prisma.order.findUnique({
        where: { orderNumber },
        select: { id: true }
      });

      if (!order) {
        skippedCount += 1;
        continue;
      }

      await prisma.customerNotification.update({
        where: { id: notification.id },
        data: { link: `/order-confirmation/${order.id}` }
      });
      updatedCount += 1;
      continue;
    }

    skippedCount += 1;
  }

  console.log(`Updated ${updatedCount} customer notification link(s).`);
  console.log(`Skipped ${skippedCount} notification(s) without an order target.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
