"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types";
import { getAllProducts } from "@/lib/products-db";
import { searchProducts } from "@/lib/search";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { buttonClasses } from "@/components/ui/Button";

export function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAllProducts()
      .then((p) => setProducts(p))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const results = useMemo(() => searchProducts(products, q), [products, q]);

  return (
    <main className="flex-1 py-10 md:py-14">
      <Container>
        <Breadcrumb
          items={[{ label: "Início", href: "/" }, { label: "Pesquisa" }]}
        />
        <h1 className="mt-5 font-display text-3xl text-ink md:text-4xl">
          Resultados para “{q}”
        </h1>
        <p className="mt-1 text-sm text-muted">
          {!loaded
            ? "A procurar…"
            : `${results.length} ${results.length === 1 ? "produto" : "produtos"}`}
        </p>

        {loaded && results.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-line py-24 text-center">
            <p className="font-display text-xl text-ink">
              Nada encontrado para “{q}”
            </p>
            <p className="max-w-xs text-sm text-muted">
              Tente outras palavras ou explore a loja.
            </p>
            <Link href="/loja" className={buttonClasses("primary", "md", "mt-2")}>
              Ver a loja
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
