"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import { useCartStore } from "@/stores/cartStore";

export default function CheckoutView() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(4500);
  const { items, total, clearCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);

  const cartTotal = total();
  const finalTotal = cartTotal + shippingFee;

  const handleDisplayTotal = (val: number) => `₦${val.toLocaleString()}`;

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty");
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

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize checkout");
      }

      // Clear the local cart before redirecting to Paystack
      clearCart();
      window.location.href = data.authorization_url;

    } catch (err: any) {
      setError(err.message);
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
          <div className="mb-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 border border-rose-100 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl text-[var(--brand-green)]" style={{ fontFamily: "var(--font-display)" }}>
              Customer Details
            </h1>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]" placeholder="First Name" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]" placeholder="Last Name" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]" placeholder="Email Address" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]" placeholder="Phone Number (+234)" />
            </div>
            <button
              className="h-12 w-full bg-[var(--brand-gold)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-green)] hover:opacity-90 transition-opacity"
              onClick={() => setStep(2)}
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
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 md:col-span-2 bg-transparent outline-none focus:border-[var(--brand-green)]" placeholder="Street Address" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]" placeholder="State" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 bg-transparent outline-none focus:border-[var(--brand-green)]" placeholder="City" />
            </div>
            <div className="space-y-3 text-sm text-[var(--brand-green)]/80 mt-6">
              <p className="font-semibold mb-2">Select your shipping rate:</p>
              {[
                { label: "Standard (Within Lagos)", fee: 4500 },
                { label: "South West", fee: 6500 },
                { label: "South East", fee: 7000 },
                { label: "South", fee: 7500 },
                { label: "Abuja", fee: 7500 },
                { label: "All Northern States", fee: 8000 },
                { label: "Pick up from Store", fee: 0 },
              ].map((loc) => (
                <label key={loc.label} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="shipping" 
                    className="accent-[var(--brand-green)]"
                    checked={shippingFee === loc.fee}
                    onChange={() => setShippingFee(loc.fee)}
                  />
                  {loc.label} {loc.fee === 0 ? "(FREE)" : `- ₦${loc.fee.toLocaleString()}`}
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
                onClick={() => setStep(3)}
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
                    <span className="truncate pr-4">{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                    <span className="shrink-0">{handleDisplayTotal(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t border-[rgba(26,60,46,0.1)] pt-4 text-sm text-[var(--brand-green)]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{handleDisplayTotal(cartTotal)}</span>
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay with Paystack`}
            </button>
            <p className="text-center text-xs text-[var(--brand-green)]/50 mt-4">Secured payment powered by Paystack</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
