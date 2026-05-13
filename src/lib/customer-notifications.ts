import { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CustomerNotificationInput = {
  customerId: string;
  title: string;
  message: string;
  type?: NotificationType | "ORDER" | "PAYMENT" | "SYSTEM";
  link?: string;
  referenceKey?: string;
};

export async function createCustomerNotification(input: CustomerNotificationInput) {
  const data = {
    customerId: input.customerId,
    title: input.title,
    message: input.message,
    type: input.type ?? NotificationType.SYSTEM,
    link: input.link,
    referenceKey: input.referenceKey
  };

  if (!input.referenceKey) {
    return prisma.customerNotification.create({ data });
  }

  return prisma.customerNotification.upsert({
    where: { referenceKey: input.referenceKey },
    update: {
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link
    },
    create: data
  });
}
