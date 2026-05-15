"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CreditCard,
  Loader2,
  LogOut,
  MapPin,
  Package,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  User2
} from "lucide-react";
import { toast } from "sonner";
import { customerSessionQueryKey } from "@/features/customer-auth/session";
import { useCartStore } from "@/stores/cartStore";

type Address = {
  address: string;
  city: string | null;
  state: string | null;
  country: string;
  zipCode: string | null;
} | null;

type AccountData = {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    instagramHandle: string | null;
    additionalInfo: string | null;
    subscribedToNewsletter: boolean;
    createdAt: string | Date;
    shippingAddress: Address;
  };
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string | Date;
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      size: string | null;
      color: string | null;
      product: {
        id: string;
        name: string;
        slug: string;
        images: string[];
      };
    }>;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link: string | null;
    createdAt: string | Date;
  }>;
  stats: {
    ordersCount: number;
    totalSpent: number;
    paidOrders: number;
    unreadNotifications: number;
  };
};

type AccountDashboardProps = {
  initialData: AccountData;
  greetingVariant?: "signup" | "login";
};

type TabKey = "overview" | "orders" | "notifications" | "profile" | "security";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  instagramHandle: string;
  additionalInfo: string;
  subscribedToNewsletter: boolean;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
};

const EMPTY_ADDRESS_FORM = {
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: ""
};

function toFormState(data: AccountData["customer"]): FormState {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone ?? "",
    instagramHandle: data.instagramHandle ?? "",
    additionalInfo: data.additionalInfo ?? "",
    subscribedToNewsletter: data.subscribedToNewsletter,
    shippingAddress: {
      address: data.shippingAddress?.address ?? "",
      city: data.shippingAddress?.city ?? "",
      state: data.shippingAddress?.state ?? "",
      country: data.shippingAddress?.country ?? "",
      zipCode: data.shippingAddress?.zipCode ?? ""
    }
  };
}

function formatMoney(value: number) {
  return `NGN ${value.toLocaleString()}`;
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function statusTone(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "PAID" || normalized === "COMPLETED" || normalized === "PROCESSING") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized === "PENDING" || normalized === "UNPAID") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-stone-200 text-stone-700";
}

function notificationLabel(type: string) {
  if (type === "ORDER") return "Order";
  if (type === "PAYMENT") return "Payment";
  return "Update";
}

function formatAddress(address: Address) {
  if (!address?.address) {
    return null;
  }

  return [
    address.address,
    address.city,
    address.state,
    address.country,
    address.zipCode
  ].filter((value) => value && value.trim().length > 0).join(", ");
}

function emptyAddress(address: FormState["shippingAddress"]) {
  return [address.address, address.city, address.state, address.zipCode].every((value) => value.trim().length === 0)
    && (address.country.trim().length === 0 || address.country.trim().toLowerCase() === "nigeria");
}

function accountGreeting(firstName: string, greetingVariant?: "signup" | "login") {
  return greetingVariant === "signup" ? `Welcome, ${firstName}.` : `Welcome back, ${firstName}.`;
}

export function AccountDashboard({ initialData, greetingVariant }: AccountDashboardProps) {
  const clearCart = useCartStore((state) => state.clearCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const syncCustomerSession = useCartStore((state) => state.syncCustomerSession);
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [form, setForm] = useState<FormState>(() => toFormState(initialData.customer));
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [notificationActionId, setNotificationActionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const contentRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const tabs = useMemo(
    () => [
      { key: "overview", label: "Overview", icon: Sparkles },
      { key: "orders", label: "Orders", icon: Package },
      { key: "notifications", label: "Notifications", icon: Bell },
      { key: "profile", label: "Profile", icon: User2 },
      { key: "security", label: "Security", icon: ShieldAlert }
    ] satisfies Array<{ key: TabKey; label: string; icon: typeof Sparkles }>,
    []
  );

  const unreadNotifications = data.notifications.filter((item) => !item.isRead).length;

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      window.requestAnimationFrame(() => {
        contentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }
  };

  const updateField = (key: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value as never }));
  };

  const updateAddressField = (
    group: "shippingAddress",
    key: keyof FormState["shippingAddress"],
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: value
      }
    }));
  };

  const reloadAccount = async () => {
    const res = await fetch("/api/customer-account", { cache: "no-store" });
    const payload = await res.json();

    if (!res.ok || !payload.data) {
      throw new Error(payload.error ?? "Failed to refresh account");
    }

    setData(payload.data);
    setForm(toFormState(payload.data.customer));
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/customer-account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shippingAddress: emptyAddress(form.shippingAddress) ? null : form.shippingAddress
        })
      });

      const payload = await res.json();
      if (!res.ok || !payload.data) {
        throw new Error(payload.error ?? "Failed to update account");
      }

      setData(payload.data);
      setForm((current) => ({
        ...current,
        shippingAddress: { ...EMPTY_ADDRESS_FORM }
      }));
      toast.success(payload.message ?? "Account updated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update account.");
    } finally {
      setIsSaving(false);
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    setNotificationActionId(notificationId);

    try {
      const res = await fetch(`/api/customer-account/notifications/${notificationId}`, {
        method: "PATCH"
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to update notification");
      }

      setData((current) => ({
        ...current,
        notifications: current.notifications.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item
        ),
        stats: {
          ...current.stats,
          unreadNotifications: Math.max(0, current.stats.unreadNotifications - 1)
        }
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update notification.");
    } finally {
      setNotificationActionId(null);
    }
  };

  const markAllNotificationsRead = async () => {
    setIsMarkingAllRead(true);

    try {
      const res = await fetch("/api/customer-account/notifications", {
        method: "PATCH"
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to mark notifications as read");
      }

      setData((current) => ({
        ...current,
        notifications: current.notifications.map((item) => ({ ...item, isRead: true })),
        stats: {
          ...current.stats,
          unreadNotifications: 0
        }
      }));
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update notifications.");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/customer-auth/logout", { method: "POST" });
      closeCart();
      clearCart();
      syncCustomerSession(null);
      queryClient.setQueryData(customerSessionQueryKey, null);
      await queryClient.invalidateQueries({ queryKey: customerSessionQueryKey });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to logout.");
      setIsLoggingOut(false);
    }
  };

  const refreshAccount = async () => {
    setIsRefreshing(true);

    try {
      setActiveTab("profile");
      await reloadAccount();
      toast.success("Account refreshed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to refresh account.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch("/api/customer-account/delete", {
        method: "DELETE"
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to delete account");
      }

      closeCart();
      clearCart();
      syncCustomerSession(null);
      queryClient.setQueryData(customerSessionQueryKey, null);
      await queryClient.invalidateQueries({ queryKey: customerSessionQueryKey });
      setIsDeleteModalOpen(false);
      toast.success(payload.message ?? "Your account has been deleted.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete account.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-cream)] px-4 py-16 text-[var(--brand-green)] sm:px-5 md:px-8">
      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(17,53,40,0.45)] px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-6 shadow-[0_30px_80px_rgba(17,53,40,0.2)]">
            <p className="text-xs uppercase tracking-[0.18em] text-rose-500/75">Confirm action</p>
            <h3 className="mt-3 text-2xl text-[var(--brand-green)]" style={{ fontFamily: "var(--font-display)" }}>
              Delete account permanently?
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--brand-green)]/70">
              This will permanently remove your profile details and sign you out. Order records will be retained without your personal details.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[rgba(17,53,40,0.15)] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--brand-green)] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void deleteAccount();
                }}
                disabled={isDeleting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rose-600 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-70"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                {isDeleting ? "Deleting account" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#113528_0%,#1b4a39_45%,#c1a36e_100%)] px-6 py-10 text-white shadow-[0_30px_80px_rgba(17,53,40,0.25)] md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/65">My Account</p>
              <h1 className="max-w-2xl text-4xl leading-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                {accountGreeting(data.customer.firstName, greetingVariant)}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                Track orders, manage your details, stay in sync with payment updates, and keep your storefront profile exactly how you want it.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Orders</p>
                <p className="mt-2 text-3xl font-semibold">{data.stats.ordersCount}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Spent</p>
                <p className="mt-2 text-3xl font-semibold">{formatMoney(data.stats.totalSpent)}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Unread</p>
                <p className="mt-2 text-3xl font-semibold">{unreadNotifications}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-3 shadow-[0_16px_40px_rgba(17,53,40,0.06)] sm:p-4">
            <div className="rounded-[24px] bg-[rgba(17,53,40,0.04)] p-4">
              <p className="text-lg font-semibold">{data.customer.firstName} {data.customer.lastName}</p>
              <p className="mt-1 text-sm text-[var(--brand-green)]/60">{data.customer.email}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--brand-green)]/45">
                Member since {formatDate(data.customer.createdAt)}
              </p>
            </div>

            <nav className="mt-4 hidden space-y-2 lg:block">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${
                      selected
                        ? "bg-[var(--brand-green)] text-white"
                        : "text-[var(--brand-green)] hover:bg-[rgba(17,53,40,0.05)]"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.08em]">
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </span>
                    {tab.key === "notifications" && unreadNotifications > 0 ? (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${selected ? "bg-white/15" : "bg-[var(--brand-gold)] text-white"}`}>
                        {unreadNotifications}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section ref={contentRef} className="min-w-0 space-y-6">
            <div className="sticky top-20 z-20 -mx-1 overflow-x-auto rounded-[24px] border border-[rgba(17,53,40,0.08)] bg-white/95 px-2 py-2 shadow-[0_16px_40px_rgba(17,53,40,0.08)] backdrop-blur [-webkit-overflow-scrolling:touch] lg:hidden">
              <div className="flex min-w-max snap-x snap-mandatory gap-2 pr-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const selected = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => handleTabChange(tab.key)}
                      className={`flex min-h-[52px] shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-2xl px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors sm:text-xs ${
                        selected
                          ? "bg-[var(--brand-green)] text-white"
                          : "bg-[rgba(17,53,40,0.04)] text-[var(--brand-green)]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.key === "notifications" && unreadNotifications > 0 ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${selected ? "bg-white/15" : "bg-[var(--brand-gold)] text-white"}`}>
                          {unreadNotifications}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTab === "overview" ? (
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-4 shadow-[0_16px_40px_rgba(17,53,40,0.06)] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-green)]/45">Recent Orders</p>
                      <h2 className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display)" }}>Your latest purchases</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="min-h-11 rounded-full border border-[rgba(17,53,40,0.15)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]"
                    >
                      View all
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {data.orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="rounded-3xl border border-[rgba(17,53,40,0.08)] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">#{order.orderNumber}</p>
                            <p className="mt-1 text-xs text-[var(--brand-green)]/55">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>{order.status}</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.paymentStatus)}`}>{order.paymentStatus}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          {order.items.slice(0, 3).map((item) => (
                            <Link
                              key={item.id}
                              href={`/shop/${item.product.slug}`}
                              className="flex min-w-0 flex-1 basis-full items-center gap-3 rounded-2xl bg-[rgba(17,53,40,0.03)] p-3 hover:bg-[rgba(17,53,40,0.05)] sm:min-w-[200px] sm:basis-auto"
                            >
                              <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[rgba(17,53,40,0.08)]">
                                {item.product.images[0] ? (
                                  <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{item.product.name}</p>
                                <p className="mt-1 text-xs text-[var(--brand-green)]/55">
                                  {item.quantity} x {formatMoney(item.price)}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-[rgba(17,53,40,0.08)] pt-4">
                          <span className="text-sm text-[var(--brand-green)]/60">Order total</span>
                          <span className="text-lg font-semibold">{formatMoney(order.total)}</span>
                        </div>
                      </div>
                    ))}

                    {data.orders.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-[rgba(17,53,40,0.15)] p-8 text-center text-sm text-[var(--brand-green)]/60">
                        You have not placed any orders yet.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-4 shadow-[0_16px_40px_rgba(17,53,40,0.06)] sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-green)]/45">Notifications</p>
                        <h2 className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display)" }}>Store updates</h2>
                      </div>
                      {unreadNotifications > 0 ? (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          disabled={isMarkingAllRead}
                          className="inline-flex min-h-11 items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-gold)] disabled:opacity-50"
                        >
                          {isMarkingAllRead ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark all read"}
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-6 space-y-3">
                      {data.notifications.slice(0, 4).map((notification) => (
                        <div
                          key={notification.id}
                          className={`rounded-3xl border p-4 ${notification.isRead ? "border-[rgba(17,53,40,0.08)] bg-white" : "border-[rgba(193,163,110,0.35)] bg-[rgba(193,163,110,0.12)]"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand-green)]/45">
                                {notificationLabel(notification.type)} • {formatDate(notification.createdAt)}
                              </p>
                              <p className="mt-2 text-sm font-semibold">{notification.title}</p>
                              <p className="mt-1 text-sm leading-6 text-[var(--brand-green)]/65">{notification.message}</p>
                              {notification.link ? (
                                <Link href={notification.link} className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-gold)]">
                                  Open
                                </Link>
                              ) : null}
                            </div>
                            {!notification.isRead ? (
                              <button
                                type="button"
                                onClick={() => markNotificationRead(notification.id)}
                                disabled={notificationActionId === notification.id}
                                className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-green)] shadow-sm disabled:opacity-60"
                              >
                                {notificationActionId === notification.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Read"}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}

                      {data.notifications.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-[rgba(17,53,40,0.15)] p-8 text-center text-sm text-[var(--brand-green)]/60">
                          No notifications yet. Payment and order updates will land here.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-4 shadow-[0_16px_40px_rgba(17,53,40,0.06)] sm:p-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-green)]/45">Saved Details</p>
                    <div className="mt-5 space-y-5 text-sm">
                      <div className="flex items-start gap-3">
                        <User2 className="mt-0.5 h-4 w-4 text-[var(--brand-gold)]" />
                        <div>
                          <p className="font-semibold">Personal</p>
                          <p className="mt-1 text-[var(--brand-green)]/60">{data.customer.email}</p>
                          <p className="text-[var(--brand-green)]/60">{data.customer.phone || "No phone added yet"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-[var(--brand-gold)]" />
                        <div>
                          <p className="font-semibold">Shipping</p>
                          <p className="mt-1 text-[var(--brand-green)]/60">
                            {formatAddress(data.customer.shippingAddress) || "No shipping address saved yet"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CreditCard className="mt-0.5 h-4 w-4 text-[var(--brand-gold)]" />
                        <div>
                          <p className="font-semibold">Newsletter</p>
                          <p className="mt-1 text-[var(--brand-green)]/60">
                            {data.customer.subscribedToNewsletter ? "Subscribed to new drops and offers." : "Not subscribed yet."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "orders" ? (
              <div className="rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-4 shadow-[0_16px_40px_rgba(17,53,40,0.06)] sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-green)]/45">Orders</p>
                    <h2 className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display)" }}>Your order history</h2>
                  </div>
                  <p className="text-sm text-[var(--brand-green)]/55">A clean record of your recent orders and payment status.</p>
                </div>

                <div className="mt-8 space-y-4">
                  {data.orders.map((order) => (
                    <div key={order.id} className="rounded-[28px] border border-[rgba(17,53,40,0.08)] p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold">#{order.orderNumber}</p>
                          <p className="mt-1 text-sm text-[var(--brand-green)]/55">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>{order.status}</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.paymentStatus)}`}>{order.paymentStatus}</span>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3">
                        {order.items.map((item) => (
                          <Link
                            key={item.id}
                            href={`/shop/${item.product.slug}`}
                            className="grid gap-3 rounded-2xl bg-[rgba(17,53,40,0.03)] p-3 sm:grid-cols-[64px_minmax(0,1fr)_auto]"
                          >
                            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[rgba(17,53,40,0.08)]">
                              {item.product.images[0] ? (
                                <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{item.product.name}</p>
                              <p className="mt-1 text-xs text-[var(--brand-green)]/55">
                                Qty {item.quantity}
                                {item.size ? ` • ${item.size}` : ""}
                                {item.color ? ` • ${item.color}` : ""}
                              </p>
                            </div>
                            <div className="text-sm font-semibold">{formatMoney(item.price * item.quantity)}</div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-[rgba(17,53,40,0.08)] pt-4">
                        <span className="text-sm text-[var(--brand-green)]/55">Order total</span>
                        <span className="text-xl font-semibold">{formatMoney(order.total)}</span>
                      </div>
                    </div>
                  ))}

                  {data.orders.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-[rgba(17,53,40,0.15)] p-10 text-center text-sm text-[var(--brand-green)]/60">
                      No order history yet. Your future purchases will appear here.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeTab === "notifications" ? (
              <div className="rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-4 shadow-[0_16px_40px_rgba(17,53,40,0.06)] sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-green)]/45">Notifications</p>
                    <h2 className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display)" }}>Your updates</h2>
                  </div>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    disabled={unreadNotifications === 0 || isMarkingAllRead}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(17,53,40,0.15)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] disabled:opacity-40"
                  >
                    {isMarkingAllRead ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark all read"}
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  {data.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-[28px] border p-4 sm:p-5 ${notification.isRead ? "border-[rgba(17,53,40,0.08)] bg-white" : "border-[rgba(193,163,110,0.4)] bg-[rgba(193,163,110,0.12)]"}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-2xl">
                          <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand-green)]/45">
                            {notificationLabel(notification.type)} • {formatDate(notification.createdAt)}
                          </p>
                          <p className="mt-2 text-lg font-semibold">{notification.title}</p>
                          <p className="mt-2 text-sm leading-7 text-[var(--brand-green)]/65">{notification.message}</p>
                          {notification.link ? (
                            <Link href={notification.link} className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-gold)]">
                              Open linked page
                            </Link>
                          ) : null}
                        </div>
                        {!notification.isRead ? (
                          <button
                            type="button"
                            onClick={() => markNotificationRead(notification.id)}
                            disabled={notificationActionId === notification.id}
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-green)] shadow-sm disabled:opacity-60"
                          >
                            {notificationActionId === notification.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark read"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {data.notifications.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-[rgba(17,53,40,0.15)] p-10 text-center text-sm text-[var(--brand-green)]/60">
                      No notifications yet. We will keep this space updated when orders move or payments are confirmed.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeTab === "profile" ? (
              <form onSubmit={saveProfile} className="rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-4 shadow-[0_16px_40px_rgba(17,53,40,0.06)] sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-green)]/45">Profile</p>
                    <h2 className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display)" }}>Personal details</h2>
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="hidden h-12 min-w-[152px] items-center justify-center rounded-full bg-[var(--brand-green)] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-70 sm:flex"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
                  </button>
                </div>

                <div className="mt-8 grid gap-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]/55">First Name</label>
                      <input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} className="h-12 w-full rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]/55">Last Name</label>
                      <input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} className="h-12 w-full rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]/55">Email</label>
                      <input value={data.customer.email ?? ""} disabled className="h-12 w-full rounded-2xl border border-[rgba(17,53,40,0.08)] bg-[rgba(17,53,40,0.04)] px-4 text-[var(--brand-green)]/55" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]/55">Phone</label>
                      <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="h-12 w-full rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" placeholder="+234..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]/55">Instagram Handle</label>
                      <input value={form.instagramHandle} onChange={(event) => updateField("instagramHandle", event.target.value)} className="h-12 w-full rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" placeholder="@delightclosetrevolution" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]/55">Additional Notes</label>
                      <textarea value={form.additionalInfo} onChange={(event) => updateField("additionalInfo", event.target.value)} className="min-h-[120px] w-full rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 py-3 outline-none focus:border-[var(--brand-gold)]" placeholder="Delivery preferences, sizing notes, or anything helpful for future orders." />
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[rgba(17,53,40,0.03)] p-5">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <div className="mt-4 grid gap-3">
                      <input value={form.shippingAddress.address} onChange={(event) => updateAddressField("shippingAddress", "address", event.target.value)} className="h-12 rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" placeholder="Street address" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input value={form.shippingAddress.city} onChange={(event) => updateAddressField("shippingAddress", "city", event.target.value)} className="h-12 rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" placeholder="City" />
                        <input value={form.shippingAddress.state} onChange={(event) => updateAddressField("shippingAddress", "state", event.target.value)} className="h-12 rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" placeholder="State" />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input value={form.shippingAddress.country} onChange={(event) => updateAddressField("shippingAddress", "country", event.target.value)} className="h-12 rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" placeholder="Country" />
                        <input value={form.shippingAddress.zipCode} onChange={(event) => updateAddressField("shippingAddress", "zipCode", event.target.value)} className="h-12 rounded-2xl border border-[rgba(17,53,40,0.12)] px-4 outline-none focus:border-[var(--brand-gold)]" placeholder="ZIP code" />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 rounded-2xl border border-[rgba(17,53,40,0.08)] bg-[rgba(17,53,40,0.03)] px-4 py-4 text-sm">
                    <input
                      type="checkbox"
                      checked={form.subscribedToNewsletter}
                      onChange={(event) => updateField("subscribedToNewsletter", event.target.checked)}
                      className="h-4 w-4 accent-[var(--brand-green)]"
                    />
                    Keep me subscribed to new arrivals, offers, and brand updates.
                  </label>

                  <div className="sticky bottom-4 z-20 -mx-1 mt-2 rounded-[24px] border border-[rgba(17,53,40,0.08)] bg-white/95 p-3 shadow-[0_16px_40px_rgba(17,53,40,0.08)] backdrop-blur sm:hidden">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand-green)] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-70"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
                    </button>
                  </div>
                </div>
              </form>
            ) : null}

            {activeTab === "security" ? (
              <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[28px] border border-[rgba(17,53,40,0.08)] bg-white p-4 shadow-[0_16px_40px_rgba(17,53,40,0.06)] sm:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-green)]/45">Session</p>
                  <h2 className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display)" }}>Stay in control</h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--brand-green)]/65">
                    Use these actions when you want to sign out on this device or close your account completely. Closing your account permanently erases your profile details while preserving order records needed for store operations.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={logout}
                      disabled={isLoggingOut}
                      className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-full bg-[var(--brand-green)] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-70"
                    >
                      {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                      {isLoggingOut ? "Logging out" : "Logout"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void refreshAccount();
                      }}
                      disabled={isRefreshing}
                      className="inline-flex h-12 min-w-[172px] items-center justify-center gap-2 rounded-full border border-[rgba(17,53,40,0.15)] px-6 text-sm font-semibold uppercase tracking-[0.12em] disabled:opacity-60"
                    >
                      {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      {isRefreshing ? "Refreshing" : "Refresh account"}
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-rose-200 bg-[linear-gradient(180deg,rgba(255,245,245,1)_0%,rgba(255,255,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(127,29,29,0.06)] sm:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-rose-500/75">Danger Zone</p>
                  <h3 className="mt-2 text-2xl text-rose-700" style={{ fontFamily: "var(--font-display)" }}>Delete account permanently</h3>
                  <p className="mt-4 text-sm leading-7 text-rose-800/70">
                    This action cannot be undone. Your personal profile details, saved addresses, and customer notifications will be removed permanently.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isDeleting}
                    className="mt-8 inline-flex h-12 min-w-[208px] items-center justify-center gap-2 rounded-full bg-rose-600 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-70"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                    {isDeleting ? "Deleting account" : "Delete account"}
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
