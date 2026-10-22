"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { EASE_PREMIUM } from "@/lib/motion";
import { productOptions, productGallery, nameFields } from "@/lib/product-options";
import { useCart } from "@/context/CartContext";
import { buttonClasses } from "@/components/ui/Button";

export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {product && <QuickViewInner product={product} onClose={onClose} />}
    </AnimatePresence>
  );
}

function QuickViewInner({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const gallery = productGallery(product);
  const options = productOptions(product);
  // peças com nome precisam da página do produto para escrever o texto
  const needsName = nameFields(product).length > 0;
  const { addItem } = useCart();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((g) => [g.label, g.values[0].value])),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const addToCart = () => {
    addItem(product, qty, options.length ? selected : undefined);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="relative z-10 grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border-[2.5px] border-ink bg-cream shadow-[8px_8px_0_var(--color-ink)] md:grid-cols-2"
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
        transition={{ duration: 0.35, ease: EASE_PREMIUM }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white transition-transform hover:rotate-90"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Galeria */}
        <div className="flex flex-col gap-3 p-4 md:p-5">
          <div
            className="aspect-square w-full rounded-[1.4rem] border-2 border-ink bg-cover bg-center"
            style={{ backgroundImage: gallery[active] }}
          />
          {gallery.length > 1 && (
            <div className="flex gap-2">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Imagem ${i + 1}`}
                  className={cn(
                    "h-14 w-14 rounded-xl border-2 border-ink bg-cover bg-center transition-all",
                    active === i ? "ring-4 ring-gold/50" : "opacity-70 hover:opacity-100",
                  )}
                  style={{ backgroundImage: g }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col overflow-y-auto p-6 md:p-8">
          <h2 className="pr-10 text-3xl text-ink">{product.name}</h2>
          <span className="mt-4 w-fit rotate-[-3deg] rounded-full border-2 border-ink bg-butter px-4 py-1 font-display text-xl font-black shadow-[3px_3px_0_var(--color-ink)]">
            {formatPrice(product.price)}
          </span>
          <p className="mt-5 text-sm font-semibold leading-relaxed text-ink/70">{product.description}</p>

          {needsName ? (
            <div className="mt-auto pt-7">
              <p className="mb-3 font-hand text-xl text-gold-deep">Esta peça leva o seu nome ✦</p>
              <Link href={`/produto/${product.slug}`} className={buttonClasses("primary", "lg", "w-full")}>
                <Sparkles className="h-4 w-4" />
                Personalizar
              </Link>
            </div>
          ) : (
            <>
              {options.map((group) => (
                <div key={group.label} className="mt-5">
                  <span className="text-sm font-bold">{group.label}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.values.map((v) => (
                      <button
                        key={v.value}
                        onClick={() => setSelected((s) => ({ ...s, [group.label]: v.value }))}
                        aria-label={v.value}
                        aria-pressed={selected[group.label] === v.value}
                        title={v.value}
                        className={cn(
                          "h-8 w-8 rounded-full border-2 border-ink transition-transform hover:scale-110",
                          selected[group.label] === v.value && "ring-4 ring-gold/50",
                        )}
                        style={{ backgroundColor: v.hex }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-auto flex items-center gap-3 pt-7">
                <div className="flex items-center rounded-full border-2 border-ink bg-white">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Diminuir"
                    className="flex h-11 w-11 items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-black">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Aumentar"
                    className="flex h-11 w-11 items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={addToCart} className={buttonClasses("primary", "lg", "flex-1")}>
                  Adicionar
                </button>
              </div>
            </>
          )}

          <Link
            href={`/produto/${product.slug}`}
            className="mt-4 text-center text-sm font-black underline-offset-4 hover:text-gold-deep hover:underline"
          >
            Ver detalhes completos
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
