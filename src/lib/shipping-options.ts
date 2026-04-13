export const SHIPPING_OPTIONS = [
  { label: "Standard (Within Lagos)", fee: 4500 },
  { label: "South West", fee: 6500 },
  { label: "South East", fee: 7000 },
  { label: "South", fee: 7500 },
  { label: "Abuja", fee: 7500 },
  { label: "All Northern States", fee: 8000 },
  { label: "Pick up from Store", fee: 0 }
] as const;

export const DEFAULT_SHIPPING_FEE = 4500;

export const ALLOWED_SHIPPING_FEES: Set<number> = new Set(
  SHIPPING_OPTIONS.map((option) => option.fee)
);
