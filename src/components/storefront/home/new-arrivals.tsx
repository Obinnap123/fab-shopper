const arrivals = [
  { name: "Palm Silk Set", price: "?48,000" },
  { name: "Zina Maxi Dress", price: "?62,500" },
  { name: "Noir Wrap Blazer", price: "?58,000" },
  { name: "Gold Coast Bag", price: "?39,000" }
];

export function NewArrivalsSection() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">New Arrivals</p>
            <h2 className="mt-3 font-serif text-4xl text-forest">Fresh arrivals, Lagos-made.</h2>
          </div>
          <button className="hidden rounded-full border border-forest px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-forest md:inline-flex">
            Shop All
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {arrivals.map((product) => (
            <div
              key={product.name}
              className="group rounded-3xl border border-forest/10 bg-white p-4 shadow-[0_20px_40px_rgba(26,60,46,0.08)]"
            >
              <div className="h-48 rounded-2xl bg-gradient-to-br from-forest/80 via-forest to-black/80" />
              <div className="mt-4">
                <p className="text-sm font-semibold text-forest">{product.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
