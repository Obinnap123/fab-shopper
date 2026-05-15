import { AnalyticsDashboard } from "@/components/admin/analytics/analytics-dashboard";
import { prisma } from "@/lib/prisma";

type SeriesPoint = { month: string; value: number };

const monthLabels = (date: Date) =>
  date.toLocaleString("en-NG", { month: "short" });

export default async function AnalyticsPage() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [orders, missingCostPrices, newCustomers] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: start } },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        shippingFee: true,
        paymentStatus: true,
        paymentMethod: true,
        paystackRef: true,
        createdAt: true,
        status: true,
        customerId: true
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.count({ where: { costPrice: null } }),
    prisma.customer.count({
      where: {
        deletedAt: null,
        createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
      }
    })
  ]);

  const months: Date[] = Array.from({ length: 12 }, (_, index) => {
    return new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
  });

  const salesSeries: SeriesPoint[] = months.map((month) => {
    const value = orders
      .filter(
        (order) =>
          order.paymentStatus === "PAID" &&
          order.createdAt.getFullYear() === month.getFullYear() &&
          order.createdAt.getMonth() === month.getMonth()
      )
      .reduce((sum, order) => sum + Number(order.total), 0);
    return { month: monthLabels(month), value };
  });

  const owedSeries: SeriesPoint[] = months.map((month) => {
    const value = orders
      .filter(
        (order) =>
          order.paymentStatus !== "PAID" &&
          order.createdAt.getFullYear() === month.getFullYear() &&
          order.createdAt.getMonth() === month.getMonth()
      )
      .reduce((sum, order) => sum + Number(order.total), 0);
    return { month: monthLabels(month), value };
  });

  const totalSales = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((sum, order) => sum + Number(order.total), 0);
  const totalOwed = orders
    .filter((order) => order.paymentStatus !== "PAID")
    .reduce((sum, order) => sum + Number(order.total), 0);
  const totalOrdered = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const shippingSpend = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((sum, order) => sum + Number(order.shippingFee), 0);

  const paidOrderIds = orders
    .filter((order) => order.paymentStatus === "PAID")
    .map((order) => order.id);

  const orderItems = paidOrderIds.length
    ? await prisma.orderItem.findMany({
        where: { orderId: { in: paidOrderIds } },
        include: { product: { select: { name: true, costPrice: true } } }
      })
    : [];

  let grossProfit = 0;
  let hasCostData = missingCostPrices === 0;
  const productRevenueMap = new Map<string, { name: string; units: number; revenue: number }>();

  for (const item of orderItems) {
    const revenue = Number(item.price) * item.quantity;
    const key = item.productId;
    const existing = productRevenueMap.get(key);
    if (existing) {
      existing.units += item.quantity;
      existing.revenue += revenue;
    } else {
      productRevenueMap.set(key, {
        name: item.product?.name ?? "Unknown",
        units: item.quantity,
        revenue
      });
    }

    if (item.product?.costPrice === null) {
      hasCostData = false;
    }

    if (item.product?.costPrice !== null && item.product?.costPrice !== undefined) {
      grossProfit += (Number(item.price) - Number(item.product.costPrice)) * item.quantity;
    }
  }

  const netProfit = hasCostData ? grossProfit - shippingSpend : null;
  const grossProfitValue = hasCostData ? grossProfit : null;

  const topProducts = Array.from(productRevenueMap.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const topRevenueProducts = Array.from(productRevenueMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const onlineTransactions = paidOrders.filter((order) => order.paystackRef).length;
  const offlineTransactions = paidOrders.length - onlineTransactions;

  const recentTransactions = paidOrders.slice(0, 6).map((order) => ({
    id: order.id,
    reference: order.orderNumber,
    channel: order.paymentMethod ?? (order.paystackRef ? "Paystack" : "Manual"),
    amount: Number(order.total),
    status: order.paymentStatus,
    date: order.createdAt.toLocaleDateString("en-NG")
  }));

  const customerOrderCounts = new Map<string, number>();
  let totalRevenue = 0;

  for (const order of orders) {
    if (order.paymentStatus === "PAID") {
      totalRevenue += Number(order.total);
    }
    if (order.customerId) {
      customerOrderCounts.set(
        order.customerId,
        (customerOrderCounts.get(order.customerId) ?? 0) + 1
      );
    }
  }

  const repeatCustomers = Array.from(customerOrderCounts.values()).filter((count) => count > 1).length;
  const customersWithOrders = customerOrderCounts.size;
  const avgLtv = customersWithOrders ? totalRevenue / customersWithOrders : 0;

  return (
    <>
      <AnalyticsDashboard
        salesSeries={salesSeries}
        owedSeries={owedSeries}
        totalSales={totalSales}
        totalOwed={totalOwed}
        totalOrdered={totalOrdered}
        grossProfit={grossProfitValue}
        netProfit={netProfit}
        missingCostPrices={missingCostPrices}
        onlineTransactions={onlineTransactions}
        offlineTransactions={offlineTransactions}
        recentTransactions={recentTransactions}
        topProducts={topProducts}
        topRevenueProducts={topRevenueProducts}
        newCustomers={newCustomers}
        repeatCustomers={repeatCustomers}
        avgLtv={avgLtv}
      />
    </>
  );
}
