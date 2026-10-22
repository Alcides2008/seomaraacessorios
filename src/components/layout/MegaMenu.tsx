"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/context/CategoriesContext";
import { DEFAULT_GRADIENT } from "@/lib/category-style";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Painel mega-menu de categorias (abre sob o cabeçalho, no hover de "Loja"). */
export function MegaMenu({
  open,
  onLinkClick,
}: {
  open: boolean;
  onLinkClick?: () => void;
}) {
  const categories = useCategories();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="absolute inset-x-0 top-full border-t border-line bg-cream/95 shadow-[0_30px_60px_-30px_rgba(20,20,20,0.35)] backdrop-blur-md"
        >
          <div className="container-siomara grid grid-cols-6 gap-4 py-9">
            {categories.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3, ease: EASE }}
              >
                <Link href={`/loja/${c.slug}`} onClick={onLinkClick} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-sand">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-premium group-hover:scale-105"
                      style={{
                        backgroundImage: c.image
                          ? `url("${c.image}")`
                          : (c.gradient ?? DEFAULT_GRADIENT),
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-4 font-display text-lg text-cream">
                      {c.name}
                    </span>
                  </div>
                  <span className="tracking-luxe mt-3 flex items-center gap-1 text-[11px] uppercase text-muted transition-colors group-hover:text-gold">
                    Ver tudo
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
