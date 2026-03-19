"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="bg-[var(--brand-cream)] px-6 py-16">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 flex items-center justify-center gap-6 text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <span className={step >= 1 ? "text-[var(--brand-green)]" : ""}>Step 1: Details</span>
          <span className={step >= 2 ? "text-[var(--brand-green)]" : ""}>Step 2: Shipping</span>
          <span className={step >= 3 ? "text-[var(--brand-green)]" : ""}>Step 3: Payment</span>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <h1 className="text-3xl text-[var(--brand-green)]" style={{ fontFamily: "var(--font-display)" }}>
              Customer Details
            </h1>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4" placeholder="First Name" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4" placeholder="Last Name" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4" placeholder="Email Address" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4" placeholder="Phone Number (+234)" />
            </div>
            <button
              className="h-12 w-full bg-[var(--brand-gold)] text-[13px] uppercase tracking-[0.12em] text-[var(--brand-green)]"
              onClick={() => setStep(2)}
            >
              Continue to Shipping
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <h1 className="text-3xl text-[var(--brand-green)]" style={{ fontFamily: "var(--font-display)" }}>
              Shipping
            </h1>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 md:col-span-2" placeholder="Street Address" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4" placeholder="State" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4" placeholder="City" />
              <input className="h-12 rounded border border-[rgba(26,60,46,0.2)] px-4 md:col-span-2" placeholder="Closest Area" />
            </div>
            <div className="space-y-2 text-sm text-[var(--text-muted)]">
              <p>Select your location:</p>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                Standard (Within Lagos) ₦4,500
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                South West ₦6,500
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                South East ₦7,000
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                South ₦7,500
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                Abuja ₦7,500
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                All Northern States ₦8,000
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                Pick up from Store FREE
              </label>
            </div>
            <button
              className="h-12 w-full bg-[var(--brand-gold)] text-[13px] uppercase tracking-[0.12em] text-[var(--brand-green)]"
              onClick={() => setStep(3)}
            >
              Continue to Payment
            </button>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-6">
            <h1 className="text-3xl text-[var(--brand-green)]" style={{ fontFamily: "var(--font-display)" }}>
              Payment
            </h1>
            <div className="rounded border border-[rgba(26,60,46,0.15)] bg-white p-6 text-sm text-[var(--text-muted)]">
              <p>Order Review will appear here.</p>
            </div>
            <button className="h-12 w-full bg-[var(--brand-gold)] text-[13px] uppercase tracking-[0.12em] text-[var(--brand-green)]">
              Pay with Paystack
            </button>
            <p className="text-center text-xs text-[var(--text-muted)]">Secured payment</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
