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
    // Honor the cookie fully, even locally, so it only pops up once.
    if (hasCookie) return;

    const timer = setTimeout(() => setOpen(true), 3000); // exactly 3 seconds

    return () => clearTimeout(timer);
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
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pointer-events-none"
          >
            <div className="pointer-events-auto relative flex w-full max-w-[850px] overflow-hidden bg-[var(--brand-cream)] shadow-2xl rounded-sm">
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black hover:bg-black/10 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Left Side: Elegant Image */}
              <div 
                className="hidden md:block md:w-[45%] lg:w-[50%] bg-cover bg-center"
                style={{ 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop")',
                  borderRight: "1px solid rgba(26,60,46,0.1)"
                }}
              />

              {/* Right Side: Content & Form */}
              <div className="flex w-full flex-col justify-center px-8 py-12 md:w-[55%] lg:w-[50%] md:px-12 bg-white">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-gold)] mb-3 font-semibold">
                  Unlock Exclusive Access
                </p>
                
                <h3
                  className="text-[36px] md:text-[42px] leading-[1.05] text-[var(--brand-green)]"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                >
                  Join the <br/> Fab Family
                </h3>
                
                <p className="mt-4 text-[14px] text-gray-500 leading-relaxed font-body">
                  Subscribe for first access to our new collections, exclusive event invites, and style inspiration.
                </p>

                {success ? (
                  <div className="mt-8 flex items-center justify-center rounded border border-[var(--brand-gold)] bg-[var(--brand-cream)] px-4 py-8 text-center text-[var(--brand-green)]">
                    <p className="text-[14px] font-medium tracking-wide">
                      Welcome to the family. Check your inbox for updates!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email address"
                        className="h-12 w-full border-b border-gray-300 bg-transparent px-2 text-[14px] text-[var(--brand-green)] transition-colors placeholder:text-gray-400 focus:border-[var(--brand-gold)] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden bg-[var(--brand-green)] text-white"
                    >
                      <span className="relative z-10 text-[12px] uppercase tracking-[0.1em] font-medium transition-colors group-hover:text-[var(--brand-gold)]">
                        Subscribe
                      </span>
                      <div className="absolute inset-0 z-0 h-full w-0 bg-[var(--brand-cream)] transition-all duration-300 ease-out group-hover:w-full border border-[var(--brand-green)]"></div>
                    </button>
                  </form>
                )}

                <p className="mt-6 text-[11px] text-gray-400">
                  By subscribing, you agree to our Terms of Service and Privacy Policy. Unsubscribe anytime.
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
