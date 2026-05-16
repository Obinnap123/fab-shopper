import type { CartItem } from "@/stores/cartStore";

export function buildCartLineId(productId: string, size?: string, color?: string) {
  return [productId, size ?? "", color ?? ""].join("__");
}

export function isSameCartLine(
  item: Pick<CartItem, "productId" | "size" | "color">,
  candidate: Pick<CartItem, "productId" | "size" | "color">
) {
  return (
    item.productId === candidate.productId &&
    item.size === candidate.size &&
    item.color === candidate.color
  );
}
