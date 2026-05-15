"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import { DEFAULT_SHIPPING_FEE, SHIPPING_OPTIONS } from "@/lib/shipping-options";
import { calculateTotalWithVat, calculateVatAmount, VAT_RATE } from "@/lib/vat";
import { useCartStore } from "@/stores/cartStore";

type CheckoutInitResponse = {
  orderId: string;
  orderNumber: string;
  amountInKobo: number;
  email: string;
  firstName: string;
  lastName: string;
  paystackPublicKey: string;
};

type CheckoutAddress = {
  address: string;
  city: string;
  state: string;
};

type CustomerDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type CheckoutFieldErrors = Partial<Record<keyof CustomerDetails | keyof CheckoutAddress, string>>;

type CustomerAccountResponse = {
  data?: {
    customer: {
      firstName: string;
      lastName: string;
      email: string | null;
      phone: string | null;
      shippingAddress: {
        address: string;
        city: string | null;
        state: string | null;
      } | null;
    };
  };
  error?: string;
};

const EMPTY_SHIPPING_ADDRESS: CheckoutAddress = {
  address: "",
  city: "",
  state: ""
};

const EMPTY_CUSTOMER_DETAILS: CustomerDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
};

export default function CheckoutView() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(DEFAULT_SHIPPING_FEE);
  const { items, total, clearCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(EMPTY_CUSTOMER_DETAILS);
  const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>(EMPTY_SHIPPING_ADDRESS);

  const subtotal = total();
  const vatAmount = calculateVatAmount(subtotal);
  const finalTotal = calculateTotalWithVat(subtotal, shippingFee);

  const handleDisplayTotal = (val: number) => `NGN ${val.toLocaleString()}`;

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const res = await fetch("/api/customer-account", {
          cache: "no-store",
          signal: controller.signal
        });

        if (!res.ok) {
          return;
        }

        const payload = (await res.json()) as CustomerAccountResponse;
        const customer = payload.data?.customer;
        const savedAddress = payload.data?.customer.shippingAddress;

        if (customer) {
          setCustomerDetails({
            firstName: customer.firstName ?? "",
            lastName: customer.lastName ?? "",
            email: customer.email ?? "",
            phone: customer.phone ?? ""
          });
        }

        if (savedAddress) {
          setShippingAddress({
            address: savedAddress.address ?? "",
            city: savedAddress.city ?? "",
            state: savedAddress.state ?? ""
          });
        }
      } catch (fetchError) {
        if ((fetchError as Error).name !== "AbortError") {
          console.error(fetchError);
        }
      }
    })();

    return () => controller.abort();
  }, []);

  const verifyPayment = async (reference: string, orderId: string) => {
    const res = await fetch("/api/paystack/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, orderId })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Payment verification failed");
    }

    return data as { verified: boolean; finalized: boolean; alreadyProcessed: boolean; orderId: string };
  };

  const updateFieldError = (field: keyof CheckoutFieldErrors, value: string) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      if (value.trim()) {
        delete next[field];
      }
      return next;
    });
  };

  const validateCustomerDetails = () => {
    const nextErrors: CheckoutFieldErrors = {};

    if (!customerDetails.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!customerDetails.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!customerDetails.email.trim()) nextErrors.email = "Email address is required.";
    if (!customerDetails.phone.trim()) nextErrors.phone = "Phone number is required.";

    setFieldErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateShippingAddress = () => {
    const nextErrors: CheckoutFieldErrors = {};

    if (!shippingAddress.address.trim()) nextErrors.address = "Street address is required.";
    if (!shippingAddress.state.trim()) nextErrors.state = "State is required.";
    if (!shippingAddress.city.trim()) nextErrors.city = "City is required.";

    setFieldErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleCustomerContinue = () => {
    if (!validateCustomerDetails()) {
      const message = "Please complete all customer details before continuing.";
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setStep(2);
  };

  const handleShippingContinue = () => {
    if (!validateShippingAddress()) {
      const message = "Please complete all shipping fields before continuing.";
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setStep(3);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty");
      toast.error("Your cart is empty. Add an item before checkout.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingDetails: { fee: shippingFee }
        })
      });

      const data = (await res.json()) as CheckoutInitResponse & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize checkout");
      }

      if (!data.paystackPublicKey) {
        throw new Error("Missing Paystack public key");
      }

      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: data.paystackPublicKey,
        email: data.email,
        amount: data.amountInKobo,
        reference: data.orderNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        metadata: {
          orderId: data.orderId,
          orderNumber: data.orderNumber
        },
        onSuccess: async (transaction: { reference?: string; trxref?: string }) => {
          try {
            const reference = transaction.reference || transaction.trxref || data.orderNumber;
            await verifyPayment(reference, data.orderId);
            clearCart();
            window.location.href = `/order-confirmation/${data.orderId}`;
          } catch (verificationError: any) {
            const message = verificationError?.message || "Payment succeeded but verification failed.";
            setError(message);
            toast.error(message);
            setLoading(false);
          }
        },
        onCancel: () => {
          setLoading(false);
        },
        onError: (err: { message?: string }) => {
          const message = err?.message || "Couldn't open Paystack checkout.";
          setError(message);
          toast.error(message);
          setLoading(false);
        }
      });
    } catch (err: any) {
      const message = err?.message || "Couldn't start checkout. Please try again.";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--brand-cream)] px-6 py-16 min-h-screen">
      <PageSpacer />
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 flex items-center justify-center gap-6 text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <span className={step >= 1 ? "text-[var(--brand-green)]" : ""}>Step 1: Details</span>
          <span className={step >= 2 ? "text-[var(--brand-green)]" : ""}>Step 2: Shipping</span>
          <span className={step >= 3 ? "text-[var(--brand-green)]" : ""}>Step 3: Payment</span>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl text-[var(--brand-green)]" style={{ fontFamily: "var(--font-display)" }}>
              Customer Details
            </h1>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <input
                  value={customerDetails.firstName}
                  onChange={(event) => {
                    const value = event.target.value;
                    setCustomerDetails((current) => ({ ...current, firstName: value }));
                    updateFieldError("firstName", value);
                  }}
                  required
                  className="h-12 w-full rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]"
                  placeholder="First Name"
                />
                {fieldErrors.firstName ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.firstName}</p> : null}
              </div>
              <div>
                <input
                  value={customerDetails.lastName}
                  onChange={(event) => {
                    const value = event.target.value;
                    setCustomerDetails((current) => ({ ...current, lastName: value }));
                    updateFieldError("lastName", value);
                  }}
                  required
                  className="h-12 w-full rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]"
                  placeholder="Last Name"
                />
                {fieldErrors.lastName ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.lastName}</p> : null}
              </div>
              <div>
                <input
                  value={customerDetails.email}
                  onChange={(event) => {
                    const value = event.target.value;
                    setCustomerDetails((current) => ({ ...current, email: value }));
                    updateFieldError("email", value);
                  }}
                  required
                  type="email"
                  className="h-12 w-full rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]"
                  placeholder="Email Address"
                />
                {fieldErrors.email ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p> : null}
              </div>
              <div>
                <input
                  value={customerDetails.phone}
                  onChange={(event) => {
                    const value = event.target.value;
                    setCustomerDetails((current) => ({ ...current, phone: value }));
                    updateFieldError("phone", value);
                  }}
                  required
                  className="h-12 w-full rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]"
                  placeholder="Phone Number (+234)"
                />
                {fieldErrors.phone ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.phone}</p> : null}
              </div>
            </div>
            <button
              className="h-12 w-full bg-[var(--brand-gold)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-green)] hover:opacity-90 transition-opacity"
              onClick={handleCustomerContinue}
            >
              Continue to Shipping
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl text-[var(--brand-green)]" style={{ fontFamily: "var(--font-display)" }}>
              Shipping
            </h1>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <input
                  value={shippingAddress.address}
                  onChange={(event) => {
                    const value = event.target.value;
                    setShippingAddress((current) => ({ ...current, address: value }));
                    updateFieldError("address", value);
                  }}
                  required
                  className="h-12 w-full rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]"
                  placeholder="Street Address"
                />
                {fieldErrors.address ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.address}</p> : null}
              </div>
              <div>
                <input
                  value={shippingAddress.state}
                  onChange={(event) => {
                    const value = event.target.value;
                    setShippingAddress((current) => ({ ...current, state: value }));
                    updateFieldError("state", value);
                  }}
                  required
                  className="h-12 w-full rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]"
                  placeholder="State"
                />
                {fieldErrors.state ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.state}</p> : null}
              </div>
              <div>
                <input
                  value={shippingAddress.city}
                  onChange={(event) => {
                    const value = event.target.value;
                    setShippingAddress((current) => ({ ...current, city: value }));
                    updateFieldError("city", value);
                  }}
                  required
                  className="h-12 w-full rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]"
                  placeholder="City"
                />
                {fieldErrors.city ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.city}</p> : null}
              </div>
            </div>
            <div className="space-y-3 text-sm text-[var(--brand-green)]/80 mt-6">
              <p className="font-semibold mb-2">Select your shipping rate:</p>
              {SHIPPING_OPTIONS.map((loc) => (
                <label key={loc.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    className="accent-[var(--brand-green)]"
                    checked={shippingFee === loc.fee}
                    onChange={() => setShippingFee(loc.fee)}
                  />
                  {loc.label} {loc.fee === 0 ? "(FREE)" : `- ${handleDisplayTotal(loc.fee)}`}
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                className="h-12 w-1/3 bg-transparent border border-[var(--brand-gold)] text-[13px] uppercase tracking-[0.12em] text-[var(--brand-green)] hover:bg-[var(--brand-gold)] transition-colors"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="h-12 w-2/3 bg-[var(--brand-gold)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-green)] hover:opacity-90 transition-opacity"
                onClick={handleShippingContinue}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl text-[var(--brand-green)]" style={{ fontFamily: "var(--font-display)" }}>
                Payment
              </h1>
              <button
                className="text-sm underline text-[var(--brand-green)]/60 hover:text-[var(--brand-green)]"
                onClick={() => setStep(2)}
              >
                Go Back
              </button>
            </div>

            <div className="rounded-xl border border-[rgba(26,60,46,0.15)] bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-[var(--brand-green)] mb-4">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-48 overflow-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm text-[var(--brand-green)]/80">
                    <span className="truncate pr-4">{item.quantity}x {item.name} {item.size ? `(${item.size})` : ""}</span>
                    <span className="shrink-0">{handleDisplayTotal(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-[rgba(26,60,46,0.1)] pt-4 text-sm text-[var(--brand-green)]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{handleDisplayTotal(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT ({VAT_RATE * 100}%)</span>
                  <span>{handleDisplayTotal(vatAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "Free" : handleDisplayTotal(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-[var(--brand-green)] pt-2 mt-2 border-t border-[rgba(26,60,46,0.1)]">
                  <span>Total</span>
                  <span>{handleDisplayTotal(finalTotal)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="h-14 w-full rounded-full bg-[var(--brand-green)] text-[13px] font-semibold uppercase tracking-[0.12em] text-white flex items-center justify-center hover:bg-[var(--brand-green)]/90 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay with Paystack"}
            </button>
            <p className="text-center text-xs text-[var(--brand-green)]/50 mt-4">Secured payment powered by Paystack</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
