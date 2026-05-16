export function formatAvailableStockMessage(stockQuantity: number) {
  if (stockQuantity <= 0) {
    return "This item is currently out of stock.";
  }

  if (stockQuantity === 1) {
    return "Only 1 item is available in stock.";
  }

  return `Only ${stockQuantity} items are available in stock.`;
}
