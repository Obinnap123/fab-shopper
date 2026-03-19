import { AdminShell } from "@/components/admin/layout/admin-shell";
import { AnalyticsDashboard } from "@/components/admin/analytics/analytics-dashboard";
import { prisma } from "@/lib/prisma";

type SeriesPoint = { month: string; value: number };

const monthLabels = (date: Date) =>
  date.toLocaleString("en-NG", { month: "short" });

export default async function AnalyticsPage() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [orders, orderItems, missingCostPrices, newCustomers] = await Promise.all([
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
    prisma.orderItem.findMany({
      include: { product: { select: { name: true, costPrice: true } } }
    }),
    prisma.product.count({ where: { costPrice: null } }),
    prisma.customer.count({
      where: { createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } }
    })
  ]);

  const months: Date[] = Array.from({ length: 12 }, (_, index) => {
    return new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
  });

  const salesSeries: SeriesPoint[] = months.map((month) => {
    const value = orders
      .filter(
        (order) =>
          order.createdAt.getFullYear() === month.getFullYear() &&
          order.createdAt.getMonth() === month.getMonth()
      )
      .reduce((sum, order) => sum + Number(order.total), 0);
    return { month: monthLabels(month), value };
  });

  const shippingSeries: SeriesPoint[] = months.map((month) => {
    const value = orders
      .filter(
        (order) =>
          order.createdAt.getFullYear() === month.getFullYear() &&
          order.createdAt.getMonth() === month.getMonth()
      )
      .reduce((sum, order) => sum + Number(order.shippingFee), 0);
    return { month: monthLabels(month), value };
  });

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const shippingSpend = orders.reduce((sum, order) => sum + Number(order.shippingFee), 0);

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
    <AdminShell>
      <AnalyticsDashboard
        salesSeries={salesSeries}
        shippingSeries={shippingSeries}
        totalSales={totalSales}
        shippingSpend={shippingSpend}
        grossProfit={grossProfitValue}
        netProfit={netProfit}
        expenses={0}
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
    </AdminShell>
  );
}
