import { ProductCard } from "@/components/storefront/products/product-card";

type Product = {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number | null;
  images: string[];
  slug: string;
};

export function ProductGrid({ products, theme = "light" }: { products: Product[]; theme?: "light" | "dark" }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} theme={theme} />
      ))}
    </div>
  );
}
