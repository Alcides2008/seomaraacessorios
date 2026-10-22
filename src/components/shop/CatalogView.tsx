"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Wand2 } from "lucide-react";
import type { Product, CategorySlug } from "@/types";
import { EASE_PREMIUM } from "@/lib/motion";
import { allColors, productHasColor } from "@/lib/product-options";
import { cn } from "@/lib/utils";
import { useCategories } from "@/context/CategoriesContext";
import { buttonClasses } from "@/components/ui/Button";
import { BowDoodle, SparkleDoodle, Squiggle } from "@/components/ui/Doodles";
import { Container } from "@/components/layout/Container";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "./QuickView";
import {
  FilterSidebar,
  emptyFilters,
  type Filters,
} from "./FilterSidebar";

type SortKey = "novidades" | "popularidade" | "preco-asc" | "preco-desc";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "novidades", label: "Novidades" },
  { value: "popularidade", label: "Mais pedidas" },
  { value: "preco-asc", label: "Preço: menor primeiro" },
  { value: "preco-desc", label: "Preço: maior primeiro" },
];

const PAGE = 8;

export function CatalogView({
  products,
  title,
  eyebrow,
  breadcrumb,
  fixedCategory,
}: {
  products: Product[];
  title: string;
  eyebrow?: string;
  breadcrumb: Crumb[];
  fixedCategory?: CategorySlug;
}) {
  // limites e listas derivados do conjunto base
  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean) as string[])],
    [products],
  );
  const colors = useMemo(() => allColors(products), [products]);

  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of products) m[p.category] = (m[p.category] ?? 0) + 1;
    return m;
  }, [products]);
  const brandCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of products) if (p.brand) m[p.brand] = (m[p.brand] ?? 0) + 1;
    return m;
  }, [products]);

  const [filters, setFilters] = useState<Filters>(() =>
    emptyFilters(priceBounds.max),
  );
  const [sort, setSort] = useState<SortKey>("novidades");
  const [visible, setVisible] = useState(PAGE);
  const [quick, setQuick] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // produtos filtrados + ordenados
  const filtered = useMemo(() => {
    const out = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category))
        return false;
      if (filters.brands.length && (!p.brand || !filters.brands.includes(p.brand)))
        return false;
      if (filters.colors.length && !filters.colors.some((c) => productHasColor(p, c)))
        return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.promoOnly && !p.compareAtPrice) return false;
      return true;
    });

    const by: Record<SortKey, (a: Product, b: Product) => number> = {
      novidades: (a, b) => Number(!!b.isNew) - Number(!!a.isNew),
      popularidade: (a, b) => Number(!!b.bestseller) - Number(!!a.bestseller),
      "preco-asc": (a, b) => a.price - b.price,
      "preco-desc": (a, b) => b.price - a.price,
    };
    return [...out].sort(by[sort]);
  }, [products, filters, sort]);

  // repõe a paginação quando muda o filtro/ordenação
  useEffect(() => setVisible(PAGE), [filters, sort]);

  const activeCount =
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    (filters.promoOnly ? 1 : 0) +
    (filters.maxPrice < priceBounds.max ? 1 : 0);

  const clear = () => setFilters(emptyFilters(priceBounds.max));
  const categories = useCategories();
  const hasPromos = products.some((p) => p.compareAtPrice);

  const sidebar = (
    <FilterSidebar
      filters={filters}
      setFilters={setFilters}
      brands={brands}
      colors={colors}
      priceBounds={priceBounds}
      categoryCounts={categoryCounts}
      brandCounts={brandCounts}
      hideCategories={!!fixedCategory}
      showPromo={hasPromos}
      onClear={clear}
    />
  );

  return (
    <main className="flex-1 py-10 md:py-14">
      <Container>
        <Breadcrumb items={breadcrumb} />

        <div className="relative mt-6">
          <BowDoodle size={72} className="absolute -top-2 right-0 hidden rotate-12 md:block" />
          {eyebrow && (
            <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-butter px-3 py-0.5 font-hand text-xl font-bold">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-3 flex items-center gap-3 text-5xl text-ink md:text-7xl">
            <span className="relative">
              {title}
              <Squiggle className="mt-1 h-3 w-40 text-gold" />
            </span>
            <SparkleDoodle size={34} className="rotate-12" />
          </h1>
        </div>

        {/* coleções em chips */}
        <div className="-mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-3 [scrollbar-width:none]">
          {[{ slug: "", name: "Tudo" }, ...categories].map((c) => {
            const isOn = (fixedCategory ?? "") === c.slug;
            return (
              <Link
                key={c.slug || "tudo"}
                href={c.slug ? `/loja/${c.slug}` : "/loja"}
                className={cn(
                  "shrink-0 rounded-full border-2 border-ink px-4 py-2 text-sm font-black transition-all",
                  isOn ? "bg-gold shadow-[3px_3px_0_var(--color-shadow)]" : "bg-white hover:-translate-y-0.5 hover:bg-sand",
                )}
              >
                {c.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-ink/20 pb-5">
          <p className="text-sm font-bold text-ink/60">
            {filtered.length} {filtered.length === 1 ? "peça feita" : "peças feitas"} à mão
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_var(--color-shadow)] lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-gold px-1 text-[10px]">
                  {activeCount}
                </span>
              )}
            </button>

            <label className="relative">
              <span className="sr-only">Ordenar</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer appearance-none rounded-full border-2 border-ink bg-white px-4 py-2 pr-9 text-sm font-black shadow-[3px_3px_0_var(--color-shadow)] focus:outline-none focus:ring-4 focus:ring-gold/40"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                ▾
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[250px_1fr]">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">{sidebar}</div>
          </aside>

          {/* Grelha */}
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-ink/40 bg-white py-20 text-center">
                <p className="font-display text-3xl text-ink">Nada por aqui…</p>
                <p className="mt-2 font-semibold text-ink/60">
                  Ajuste os filtros — ou crie a peça do zero no Atelier.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={clear} className={buttonClasses("outline", "md")}>
                    Limpar filtros
                  </button>
                  <Link href="/criar" className={buttonClasses("primary", "md")}>
                    Abrir o Atelier
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                  {filtered.slice(0, visible).map((p, i) => (
                    <Fragment key={p.id}>
                      <ProductCard product={p} onQuickView={setQuick} />
                      {i === 2 && <AtelierCard />}
                    </Fragment>
                  ))}
                </div>

                {visible < filtered.length && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={() => setVisible((v) => v + PAGE)}
                      className={buttonClasses("outline", "lg")}
                    >
                      Carregar mais
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>

      {/* Drawer de filtros (mobile) */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink/40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-r-2 border-ink bg-cream"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: EASE_PREMIUM }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <span className="font-display text-2xl">Filtros</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar"
                  className="text-muted hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">{sidebar}</div>
              <div className="border-t border-line p-4">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className={buttonClasses("primary", "lg", "w-full")}
                >
                  Ver {filtered.length} resultados
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </main>
  );
}

/** Cartão no meio da grelha: convite para criar a peça no Atelier. */
function AtelierCard() {
  return (
    <Link
      href="/criar"
      className="group relative flex flex-col justify-between overflow-hidden rounded-[1.6rem] border-2 border-ink bg-linear-to-br from-gold via-champagne to-lilac p-5 shadow-[4px_4px_0_var(--color-shadow)] transition-all hover:-translate-y-1 hover:rotate-1 hover:shadow-[7px_7px_0_var(--color-shadow)]"
    >
      <SparkleDoodle size={34} className="absolute right-3 top-3 transition-transform group-hover:rotate-45" />
      <span className="font-hand text-2xl font-bold">não encontrou?</span>
      <span className="mt-6 font-display text-3xl font-black leading-none md:text-4xl">
        Crie a sua no Atelier
      </span>
      <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-black">
        <Wand2 className="h-4 w-4" /> Começar
      </span>
    </Link>
  );
}
