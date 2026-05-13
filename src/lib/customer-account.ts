import { redirect } from "next/navigation";
import { NotificationType, Prisma } from "@prisma/client";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

const accountCustomerSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  instagramHandle: true,
  additionalInfo: true,
  subscribedToNewsletter: true,
  createdAt: true,
  shippingAddress: true,
  billingAddress: true
} satisfies Prisma.CustomerSelect;

const accountOrderSelect = {
  id: true,
  orderNumber: true,
  total: true,
  status: true,
  paymentStatus: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      quantity: true,
      price: true,
      size: true,
      color: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: true
        }
      }
    }
  }
} satisfies Prisma.OrderSelect;

const accountNotificationSelect = {
  id: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
  link: true,
  createdAt: true
} satisfies Prisma.CustomerNotificationSelect;

export async function requireActiveCustomer(redirectTo?: string) {
  const session = await getCustomerSession();

  if (!session) {
    const next = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "";
    redirect(`/login${next}`);
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: session.id,
      deletedAt: null
    },
    select: accountCustomerSelect
  });

  if (!customer) {
    const next = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "";
    redirect(`/login${next}`);
  }

  return customer;
}

export async function getActiveCustomerFromSession() {
  const session = await getCustomerSession();
  if (!session) {
    return null;
  }

  return prisma.customer.findFirst({
    where: {
      id: session.id,
      deletedAt: null
    },
    select: accountCustomerSelect
  });
}

export async function getCustomerSessionSnapshot() {
  const session = await getCustomerSession();
  if (!session) {
    return null;
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: session.id,
      deletedAt: null
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      notifications: {
        where: { isRead: false },
        select: { id: true },
        take: 20
      }
    }
  });

  if (!customer) {
    return null;
  }

  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    unreadNotifications: customer.notifications.length
  };
}

export async function getCustomerAccountPageData(customerId: string) {
  const [customer, orders, notifications, unreadCount, ordersCount, paidOrdersCount, totalSpent] = await Promise.all([
    prisma.customer.findFirst({
      where: { id: customerId, deletedAt: null },
      select: accountCustomerSelect
    }),
    prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: accountOrderSelect
    }),
    prisma.customerNotification.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: accountNotificationSelect
    }),
    prisma.customerNotification.count({
      where: { customerId, isRead: false }
    }),
    prisma.order.count({
      where: { customerId }
    }),
    prisma.order.count({
      where: { customerId, paymentStatus: "PAID" }
    }),
    prisma.order.aggregate({
      where: { customerId },
      _sum: {
        total: true
      }
    })
  ]);

  if (!customer) {
    return null;
  }

  return {
    customer,
    orders: orders.map((order) => ({
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price)
      }))
    })),
    notifications,
    stats: {
      ordersCount,
      totalSpent: Number(totalSpent._sum.total ?? 0),
      paidOrders: paidOrdersCount,
      unreadNotifications: unreadCount
    }
  };
}

export function getNotificationAccent(type: NotificationType) {
  if (type === NotificationType.ORDER) {
    return "Order";
  }

  if (type === NotificationType.PAYMENT) {
    return "Payment";
  }

  return "Update";
}
