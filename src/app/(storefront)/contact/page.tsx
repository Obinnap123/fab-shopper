import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-[var(--brand-cream)] min-h-screen">
      <PageSpacer />
      
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display italic text-[var(--brand-green)] mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-[var(--brand-green)]/70 max-w-2xl mx-auto">
              Have a question about an order, styling advice, or our boutique? We are always here to help you elevate your closet.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Info */}
            <div className="bg-white p-10 md:p-14 rounded-3xl shadow-[0_12px_40px_rgba(26,60,46,0.06)] border border-[rgba(26,60,46,0.05)] order-2 lg:order-1">
              <h2 className="text-3xl font-display italic text-[var(--brand-green)] mb-8">
                Visit The Boutique
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-gold)]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--brand-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--brand-green)] mb-1">Address</h3>
                    <p className="text-[var(--brand-green)]/70 text-sm leading-relaxed">
                      Shop A23, Justice Mall<br />
                      Nnobi Lane, SPG Bus Stop<br />
                      Lekki, Lagos State, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-gold)]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[var(--brand-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--brand-green)] mb-1">Phone Number</h3>
                    <p className="text-[var(--brand-green)]/70 text-sm leading-relaxed">
                      +234 905 261 3150 <br />
                      <span className="text-xs opacity-70">(Calls and WhatsApp)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-gold)]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[var(--brand-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--brand-green)] mb-1">Email</h3>
                    <p className="text-[var(--brand-green)]/70 text-sm leading-relaxed">
                      hello@fabshopper.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-gold)]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[var(--brand-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--brand-green)] mb-1">Store Hours</h3>
                    <p className="text-[var(--brand-green)]/70 text-sm leading-relaxed">
                      Monday - Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl font-semibold text-[var(--brand-green)] mb-6">Send a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">First Name</label>
                    <input className="w-full h-12 px-4 rounded-xl border border-[var(--brand-green)]/20 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)] bg-transparent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">Last Name</label>
                    <input className="w-full h-12 px-4 rounded-xl border border-[var(--brand-green)]/20 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)] bg-transparent transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">Email Address</label>
                  <input type="email" className="w-full h-12 px-4 rounded-xl border border-[var(--brand-green)]/20 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)] bg-transparent transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">Message</label>
                  <textarea className="w-full h-32 p-4 rounded-xl border border-[var(--brand-green)]/20 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)] bg-transparent transition-all resize-none"></textarea>
                </div>

                <button
                  type="button"
                  className="h-14 w-full md:w-auto md:px-10 rounded-full bg-[var(--brand-green)] text-[13px] font-semibold uppercase tracking-[0.12em] text-white flex items-center justify-center hover:bg-[var(--brand-green)]/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
