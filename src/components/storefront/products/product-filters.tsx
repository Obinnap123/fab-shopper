"use client";

import { motion } from "framer-motion";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42"];
const categories = [
  "Women's Shoes",
  "Men's Shoes",
  "Bags & Purses",
  "Clothing",
  "Perfumes",
  "Accessories",
  "Wristwatches",
  "Wristbands"
];

const styles = ["Casual", "Formal", "Smart Casual", "Streetwear"];
const occasions = ["Everyday", "Office", "Party", "Special Occasion"];
const colors = ["#111111", "#8b5e3c", "#c9a84c", "#9c2b2b", "#1a3c2e", "#6b7280"];

type Filters = {
  category: string[];
  size: string[];
  color: string[];
  minPrice: string;
  maxPrice: string;
  style: string[];
  occasion: string[];
};

export function ProductFilters({
  filters,
  setFilters,
  onClear
}: {
  filters: Filters;
  setFilters: (next: Filters) => void;
  onClear: () => void;
}) {
  const toggle = (key: keyof Filters, value: string) => {
    const existing = (filters[key] as string[]).includes(value);
    const next = existing
      ? (filters[key] as string[]).filter((item) => item !== value)
      : [...(filters[key] as string[]), value];
    setFilters({ ...filters, [key]: next });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-gold)]">Filter & Sort</p>
      </div>

      <FilterSection title="Category">
        {categories.map((category) => (
          <label key={category} className="flex items-center gap-2 text-sm text-[var(--text-dark)]">
            <input
              type="checkbox"
              checked={filters.category.includes(category)}
              onChange={() => toggle("category", category)}
            />
            {category}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`rounded-full border px-3 py-1 text-xs ${
                filters.size.includes(size)
                  ? "border-[var(--brand-gold)] bg-[var(--brand-gold)] text-[var(--brand-green)]"
                  : "border-[rgba(26,60,46,0.2)] text-[var(--text-dark)]"
              }`}
              onClick={() => toggle("size", size)}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`h-6 w-6 rounded-full border-2 ${
                filters.color.includes(color) ? "border-[var(--brand-gold)]" : "border-transparent"
              }`}
              style={{ background: color }}
              onClick={() => toggle("color", color)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            ₦0
            <input
              type="range"
              min={0}
              max={500000}
              value={Number(filters.minPrice || 0)}
              onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })}
              className="w-full accent-[var(--brand-gold)]"
            />
            ₦500k
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            ₦0
            <input
              type="range"
              min={0}
              max={500000}
              value={Number(filters.maxPrice || 500000)}
              onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })}
              className="w-full accent-[var(--brand-gold)]"
            />
            ₦500k
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Style">
        {styles.map((style) => (
          <label key={style} className="flex items-center gap-2 text-sm text-[var(--text-dark)]">
            <input
              type="checkbox"
              checked={filters.style.includes(style)}
              onChange={() => toggle("style", style)}
            />
            {style}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Occasion">
        {occasions.map((occasion) => (
          <label key={occasion} className="flex items-center gap-2 text-sm text-[var(--text-dark)]">
            <input
              type="checkbox"
              checked={filters.occasion.includes(occasion)}
              onChange={() => toggle("occasion", occasion)}
            />
            {occasion}
          </label>
        ))}
      </FilterSection>

      <button
        type="button"
        className="text-xs uppercase tracking-[0.2em] text-[var(--brand-gold)] underline"
        onClick={onClear}
      >
        Clear All Filters
      </button>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xs uppercase tracking-[0.3em] text-[var(--text-dark)]"
      >
        {title}
      </motion.div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
