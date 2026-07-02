import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/http-error";
import { ALLOWED_SHIPPING_FEES, DEFAULT_SHIPPING_FEE } from "@/lib/shipping-options";
import { calculateTotalWithVat, calculateVatAmount } from "@/lib/vat";
import { createCustomerNotification } from "@/lib/customer-notifications";
import { getPaystackPublicKey } from "@/lib/paystack";
import type { CustomerSession } from "@/lib/customer-auth";
import type { CheckoutInput, CreateOrderInput } from "@/features/orders/order-schemas";

type ListOrdersFilters = {
  take: number;
  skip: number;
  search?: string | null;
  dateRange?: string | null;
  delivery?: string | null;
};

export async function listOrders(filters: ListOrdersFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: "insensitive" } },
      { customer: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { customer: { lastName: { contains: filters.search, mode: "insensitive" } } }
    ];
  }

  if (filters.delivery === "delivery") {
    where.shippingFee = { gt: 0 };
  }

  if (filters.delivery === "pickup") {
    where.shippingFee = { lte: 0 };
  }

  const now = new Date();
  let start: Date | null = null;
  let end: Date | null = null;

  if (filters.dateRange === "this-month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (filters.dateRange === "last-month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (filters.dateRange === "last-3") {
    start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  if (start && end) {
    where.createdAt = { gte: start, lt: end };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      take: filters.take,
      skip: filters.skip,
      where,
      orderBy: { createdAt: "desc" },
      include: { customer: true, items: true }
    }),
    prisma.order.count({ where })
  ]);

  return { data: orders, total };
}

export async function createAdminOrder(input: CreateOrderInput) {
  let subtotal = 0;
  const normalizedItems: { productId: string; quantity: number; price: number }[] = [];

  for (const item of input.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || product.deletedAt) {
      throw new HttpError(`Product not found: ${item.productId}`, 404);
    }

    if (item.quantity > product.stockQuantity) {
      throw new HttpError(
        `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
        409
      );
    }

    const price = Number(product.discountedPrice ?? product.price);
    subtotal += price * item.quantity;
    normalizedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price
    });
  }

  const total = subtotal + input.shippingFee + input.vatAmount;
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return prisma.order.create({
    data: {
      orderNumber,
      customerId: input.customerId,
      subtotal,
      shippingFee: input.shippingFee,
      vatAmount: input.vatAmount,
      total,
      status: input.status ?? "PENDING",
      paymentStatus: input.paymentStatus ?? "UNPAID",
      items: {
        create: normalizedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });
}

export async function createCheckoutOrder(session: CustomerSession, input: CheckoutInput) {
  let subtotal = 0;
  const orderItems: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[] = [];

  for (const item of input.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { variants: true }
    });

    if (!product || product.deletedAt) {
      throw new HttpError(`Product ${item.productId} not found`, 404);
    }

    if (product.status === "OUT_OF_STOCK") {
      throw new HttpError(`${product.name} is out of stock`, 409);
    }

    const selectedVariant = item.size || item.color
      ? product.variants.find((variant) => {
          const sizeMatches = item.size ? variant.size === item.size : true;
          const colorMatches = item.color ? variant.color === item.color : true;
          return sizeMatches && colorMatches;
        })
      : undefined;

    if ((item.size || item.color) && !selectedVariant) {
      throw new HttpError(`Selected variation is no longer available for ${product.name}`, 409);
    }

    const availableStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
    if (item.quantity > availableStock) {
      throw new HttpError(
        `Only ${availableStock} unit(s) left for ${product.name}${selectedVariant ? " (selected variation)" : ""}`,
        409
      );
    }

    const price = Number(product.discountedPrice || product.price);
    subtotal += price * item.quantity;

    orderItems.push({
      productId: item.productId,
      variantId: selectedVariant?.id,
      quantity: item.quantity,
      price,
      size: item.size,
      color: item.color
    });
  }

  const shippingFee = input.shippingDetails?.fee ?? DEFAULT_SHIPPING_FEE;
  if (!ALLOWED_SHIPPING_FEES.has(shippingFee)) {
    throw new HttpError("Invalid shipping option selected", 400);
  }

  const vatAmount = calculateVatAmount(subtotal);
  const total = calculateTotalWithVat(subtotal, shippingFee);
  const orderNumber = `FAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: session.id,
      subtotal,
      shippingFee,
      vatAmount,
      total,
      status: "PENDING",
      paymentStatus: "UNPAID",
      paymentMethod: "PAYSTACK",
      items: {
        create: orderItems
      }
    }
  });

  await createCustomerNotification({
    customerId: session.id,
    title: `Order ${orderNumber} created`,
    message: "Your order has been created and is waiting for payment confirmation.",
    type: "ORDER",
    link: `/order-confirmation/${order.id}`,
    referenceKey: `order-created-${order.id}`
  });

  return {
    orderId: order.id,
    orderNumber,
    amountInKobo: Math.round(total * 100),
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    paystackPublicKey: getPaystackPublicKey()
  };
}
