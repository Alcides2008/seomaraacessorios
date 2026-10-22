"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { EASE_PREMIUM } from "@/lib/motion";
import { getAllProducts } from "@/lib/products-db";
import { searchProducts } from "@/lib/search";
import { formatPrice } from "@/lib/utils";
import { productCover } from "@/lib/product-options";
import { useCategories } from "@/context/CategoriesContext";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const categories = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");

  // carrega os produtos na primeira abertura
  useEffect(() => {
    if (open && !loaded) {
      getAllProducts()
        .then((p) => setProducts(p))
        .catch(() => {})
        .finally(() => setLoaded(true));
    }
  }, [open, loaded]);

  // Esc para fechar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const all = useMemo(
    () => searchProducts(products, query),
    [products, query],
  );
  const results = all.slice(0, 6);
  const hasQuery = query.trim().length > 0;

  const goSearch = () => {
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/pesquisa?q=${encodeURIComponent(q)}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 top-0 max-h-[90vh] overflow-y-auto bg-cream px-6 py-8 md:py-12"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          >
            <div className="container-siomara">
              <div className="flex items-center justify-between">
                <span className="tracking-luxe text-xs uppercase text-muted">
                  Pesquisar
                </span>
                <button
                  onClick={onClose}
                  aria-label="Fechar pesquisa"
                  className="text-muted transition-colors hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  goSearch();
                }}
                className="mt-6 flex items-center gap-4 border-b border-line focus-within:border-gold"
              >
                <Search className="h-6 w-6 shrink-0 text-muted" />
                {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="O que procura?"
                  className="w-full bg-transparent pb-4 font-display text-2xl text-ink placeholder:text-muted/40 focus:outline-none md:text-4xl"
                />
                {hasQuery && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Limpar"
                    className="text-muted hover:text-ink"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </form>

              {hasQuery ? (
                <div className="mt-6">
                  {!loaded ? (
                    <p className="text-sm text-muted">A procurar…</p>
                  ) : results.length === 0 ? (
                    <p className="text-sm text-muted">
                      Nenhum produto encontrado para “{query}”.
                    </p>
                  ) : (
                    <>
                      <ul className="flex flex-col divide-y divide-line">
                        {results.map((p) => (
                          <li key={p.id}>
                            <Link
                              href={`/produto/${p.slug}`}
                              onClick={onClose}
                              className="group flex items-center gap-4 py-3"
                            >
                              <div
                                className="h-14 w-12 shrink-0 rounded-sm bg-cover bg-center"
                                style={{ backgroundImage: productCover(p) }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-ink transition-colors group-hover:text-gold-deep">
                                  {p.name}
                                </p>
                                <p className="text-xs text-muted">
                                  {formatPrice(p.price)}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {all.length > results.length && (
                        <button
                          onClick={goSearch}
                          className="tracking-luxe mt-4 text-[11px] uppercase text-gold underline-offset-4 hover:underline"
                        >
                          Ver todos os {all.length} resultados
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-7">
                  <span className="tracking-luxe text-[11px] uppercase text-muted/70">
                    Categorias
                  </span>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {categories.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => {
                          onClose();
                          router.push(`/loja/${c.slug}`);
                        }}
                        className="tracking-luxe rounded-full border border-line px-4 py-2 text-[11px] uppercase text-muted transition-colors hover:border-gold hover:text-gold"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
