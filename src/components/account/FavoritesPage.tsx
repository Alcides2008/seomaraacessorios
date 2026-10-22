"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { useWishlist } from "@/context/WishlistContext";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import { buttonClasses } from "@/components/ui/Button";

export function FavoritesPage() {
  const { items, count } = useWishlist();
  const [quick, setQuick] = useState<Product | null>(null);

  return (
    <main className="flex-1 py-10 md:py-14">
      <Container>
        <Breadcrumb
          items={[{ label: "Início", href: "/" }, { label: "Favoritos" }]}
        />
        <h1 className="mt-5 text-5xl text-ink md:text-6xl">
          Favoritos
        </h1>
        <p className="mt-1 text-sm text-muted">
          {count} {count === 1 ? "produto guardado" : "produtos guardados"}
        </p>

        {count === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-[1.6rem] border-2 border-dashed border-ink/30 bg-white py-24 text-center">
            <Heart className="h-10 w-10 text-muted/40" strokeWidth={1} />
            <p className="font-display text-xl text-ink">
              Ainda não tem favoritos
            </p>
            <p className="max-w-xs text-sm text-muted">
              Toque no coração dos produtos que mais gosta para os guardar aqui.
            </p>
            <Link href="/loja" className={buttonClasses("primary", "md", "mt-2")}>
              Explorar a loja
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuick} />
            ))}
          </div>
        )}
      </Container>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </main>
  );
}
