const orders = [
  {
    orderNumber: "ORD-00021",
    customer: "Zainab Bello",
    total: "?86,000",
    status: "Processing",
    payment: "Paid",
    date: "Mar 12, 2026"
  },
  {
    orderNumber: "ORD-00020",
    customer: "Renee Okafor",
    total: "?52,500",
    status: "Pending",
    payment: "Unpaid",
    date: "Mar 10, 2026"
  },
  {
    orderNumber: "ORD-00019",
    customer: "Folasade Musa",
    total: "?120,000",
    status: "Completed",
    payment: "Paid",
    date: "Mar 09, 2026"
  }
];

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Abandoned: "bg-neutral-200 text-neutral-700"
};

const paymentStyles: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Unpaid: "bg-yellow-100 text-yellow-800",
  Refunded: "bg-red-100 text-red-800"
};

export function RecentOrders() {
  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_15px_40px_rgba(26,60,46,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Recent Orders</p>
          <h3 className="mt-2 text-xl font-semibold text-forest">Latest activity</h3>
        </div>
        <button className="rounded-full border border-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-forest">
          View All
        </button>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.3em] text-forest/50">
            <tr>
              <th className="pb-3">Order</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Payment</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody className="text-forest/70">
            {orders.map((order) => (
              <tr key={order.orderNumber} className="border-t border-forest/10">
                <td className="py-3 font-semibold text-forest">{order.orderNumber}</td>
                <td className="py-3">{order.customer}</td>
                <td className="py-3">{order.total}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[order.status] ?? "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      paymentStyles[order.payment] ?? "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {order.payment}
                  </span>
                </td>
                <td className="py-3">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
