"use client";

import { useApp } from "@/hooks/use-app";
import { ProductCard } from "./product-card";

export function ProductGrid() {
  const { products } = useApp();

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No products available at the moment. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
