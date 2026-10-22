"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { productCover } from "@/lib/product-options";
import { EASE_PREMIUM } from "@/lib/motion";
import { buttonClasses } from "@/components/ui/Button";

// detalhes técnicos de peças do Atelier: vão na encomenda, não precisam de aparecer aqui
export const HIDDEN_OPTIONS = ["Design", "Sequência"];

export function CartDrawer() {
  const { lines, subtotal, count, isOpen, closeCart, updateQty, removeItem } =
    useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40" onClick={closeCart} />

          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-cream"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b-2 border-ink px-6 py-5">
              <span className="font-display text-2xl text-ink">
                Carrinho ({count})
              </span>
              <button
                onClick={closeCart}
                aria-label="Fechar carrinho"
                className="text-muted transition-colors hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-muted/40" strokeWidth={1} />
                <p className="font-display text-xl text-ink">
                  O seu carrinho está vazio
                </p>
                <button
                  onClick={closeCart}
                  className={buttonClasses("outline", "md", "mt-2")}
                >
                  Continuar a comprar
                </button>
              </div>
            ) : (
              <>
                <p className="border-b-2 border-ink bg-butter px-6 py-2.5 text-center text-sm font-bold">
                  ✦ Cada peça é feita à mão depois da encomenda
                </p>

                {/* Linhas */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="flex flex-col gap-5">
                    {lines.map((l) => (
                      <li key={l.id} className="flex gap-4">
                        <Link
                          href={`/produto/${l.product.slug}`}
                          onClick={closeCart}
                          className="h-24 w-20 shrink-0 rounded-xl border-2 border-ink bg-cover bg-center"
                          style={{ backgroundImage: productCover(l.product) }}
                          aria-label={l.product.name}
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/produto/${l.product.slug}`}
                              onClick={closeCart}
                              className="text-sm font-extrabold text-ink hover:text-gold-deep"
                            >
                              {l.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(l.id)}
                              aria-label="Remover"
                              className="text-muted transition-colors hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {l.options && (
                            <span className="mt-0.5 text-xs text-muted">
                              {Object.entries(l.options)
                                .filter(([k]) => !HIDDEN_OPTIONS.includes(k))
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" · ")}
                            </span>
                          )}

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border-2 border-ink bg-white">
                              <button
                                onClick={() =>
                                  updateQty(l.id, l.quantity - 1)
                                }
                                aria-label="Diminuir"
                                className="flex h-8 w-8 items-center justify-center text-ink hover:text-gold"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm">
                                {l.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQty(l.id, l.quantity + 1)
                                }
                                aria-label="Aumentar"
                                className="flex h-8 w-8 items-center justify-center text-ink hover:text-gold"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm text-ink">
                              {formatPrice(l.product.price * l.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rodapé */}
                <div className="border-t-2 border-ink px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-base text-ink">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Entrega combinada consigo pelo WhatsApp.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className={buttonClasses("primary", "lg", "mt-4 w-full")}
                  >
                    Finalizar compra
                  </Link>
                  <Link
                    href="/carrinho"
                    onClick={closeCart}
                    className="mt-3 block text-center text-sm font-black underline-offset-4 hover:text-gold-deep hover:underline"
                  >
                    Ver carrinho
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
