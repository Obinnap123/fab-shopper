const collections = [
  { name: "New Arrivals", description: "Latest Lagos drops", tone: "from-forest/90" },
  { name: "Best Sellers", description: "Iconic silhouettes", tone: "from-forest" },
  { name: "Sale", description: "Limited-time offers", tone: "from-forest/80" }
];

export function FeaturedCollections() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">Collections</p>
            <h2 className="mt-3 font-serif text-4xl text-forest">Curated edits for every mood.</h2>
          </div>
          <button className="hidden rounded-full border border-forest px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-forest md:inline-flex">
            View All
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <div
              key={collection.name}
              className="group relative h-72 overflow-hidden rounded-3xl bg-forest text-cream"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${collection.tone} via-forest to-black/80 transition duration-500 group-hover:scale-105`}
              />
              <div className="relative z-10 flex h-full flex-col justify-end p-8">
                <p className="text-xs uppercase tracking-[0.4em] text-gold">{collection.description}</p>
                <h3 className="mt-3 text-2xl font-semibold">{collection.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
