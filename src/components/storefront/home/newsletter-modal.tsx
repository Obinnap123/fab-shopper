"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const cookieKey = "fab_newsletter";

export function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hasCookie = document.cookie.includes(`${cookieKey}=true`);
    if (hasCookie) return;

    const timer = setTimeout(() => setOpen(true), 4000);

    const handleExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 10 && !open) {
        setOpen(true);
      }
    };

    window.addEventListener("mouseleave", handleExitIntent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mouseleave", handleExitIntent);
    };
  }, [open]);

  const closeModal = () => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `${cookieKey}=true; expires=${expires.toUTCString()}; path=/`;
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      setSuccess(true);
      setTimeout(() => {
        closeModal();
        setSuccess(false);
        setEmail("");
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(10, 25, 15, 0.85)" }}
            onClick={closeModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="pointer-events-auto w-[90vw] max-w-[480px] rounded bg-[var(--brand-green)] p-8 text-center text-white shadow-2xl"
              style={{ border: "1px solid rgba(201,168,76,0.4)" }}
            >
              <button
                onClick={closeModal}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="mt-2 text-[11px] uppercase tracking-[0.5em] text-[var(--brand-gold)]">
                Join the Fab Family
              </p>
              <h3
                className="mt-4 text-[42px] leading-[1.1] text-[var(--brand-gold)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                Style Updates,
                <br />
                Delivered to You.
              </h3>
              <p className="mx-auto mt-4 max-w-[320px] text-sm text-white/70">
                Be the first to know about new arrivals, exclusive deals, and style inspiration
                straight from our Lagos boutique.
              </p>

              {success ? (
                <p className="mt-6 text-sm text-[var(--brand-gold)]">
                  You&apos;re in! Welcome to the Fab Family.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email address"
                    className="h-12 w-full rounded border border-[rgba(201,168,76,0.4)] bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                  />
                  <button
                    type="submit"
                    className="h-12 w-full rounded bg-[var(--brand-gold)] text-[13px] uppercase tracking-[0.12em] text-[var(--brand-green)]"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
                  >
                    Subscribe
                  </button>
                </form>
              )}

              <p className="mt-4 text-[11px] text-white/40">No spam. Unsubscribe anytime.</p>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
