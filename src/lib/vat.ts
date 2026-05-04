export const VAT_RATE = 0.075;

export function calculateVatAmount(subtotal: number) {
  return Number((subtotal * VAT_RATE).toFixed(2));
}

export function calculateTotalWithVat(subtotal: number, shippingFee = 0) {
  return Number((subtotal + calculateVatAmount(subtotal) + shippingFee).toFixed(2));
}
