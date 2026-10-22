"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { productCover } from "@/lib/product-options";
import { shippingFor, shippingText } from "@/lib/account";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { buttonClasses } from "@/components/ui/Button";
import { HIDDEN_OPTIONS } from "./CartDrawer";

export function CartPage() {
  const { lines, subtotal, count, updateQty, removeItem } = useCart();
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  return (
    <main className="flex-1 py-10 md:py-14">
      <Container>
        <Breadcrumb
          items={[{ label: "Início", href: "/" }, { label: "Carrinho" }]}
        />
        <h1 className="mt-5 text-5xl text-ink md:text-6xl">
          Carrinho
        </h1>

        {count === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-[1.6rem] border-2 border-dashed border-ink/30 bg-white py-24 text-center">
            <ShoppingBag className="h-10 w-10 text-muted/40" strokeWidth={1} />
            <p className="font-display text-xl text-ink">
              O seu carrinho está vazio
            </p>
            <Link href="/loja" className={buttonClasses("primary", "md", "mt-2")}>
              Ir para a loja
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* Linhas */}
            <ul className="flex flex-col gap-4">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-5 rounded-[1.6rem] border-2 border-ink bg-white p-4 shadow-[4px_4px_0_var(--color-shadow)]">
                  <Link
                    href={`/produto/${l.product.slug}`}
                    className="h-32 w-24 shrink-0 rounded-xl border-2 border-ink bg-cover bg-center"
                    style={{ backgroundImage: productCover(l.product) }}
                    aria-label={l.product.name}
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        {l.product.brand && (
                          <span className="text-xs font-bold text-ink/50">
                            {l.product.brand}
                          </span>
                        )}
                        <Link
                          href={`/produto/${l.product.slug}`}
                          className="block font-extrabold text-ink hover:text-gold-deep"
                        >
                          {l.product.name}
                        </Link>
                        {l.options && (
                          <span className="mt-1 block text-xs text-muted">
                            {Object.entries(l.options)
                              .filter(([k]) => !HIDDEN_OPTIONS.includes(k))
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(l.id)}
                        aria-label="Remover"
                        className="h-fit text-muted transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div className="flex items-center rounded-full border-2 border-ink bg-white">
                        <button
                          onClick={() => updateQty(l.id, l.quantity - 1)}
                          aria-label="Diminuir"
                          className="flex h-9 w-9 items-center justify-center text-ink hover:text-gold"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm">
                          {l.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(l.id, l.quantity + 1)}
                          aria-label="Aumentar"
                          className="flex h-9 w-9 items-center justify-center text-ink hover:text-gold"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-base text-ink">
                          {formatPrice(l.product.price * l.quantity)}
                        </span>
                        {l.quantity > 1 && (
                          <span className="block text-xs text-muted">
                            {formatPrice(l.product.price)} cada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Resumo */}
            <aside className="h-fit lg:sticky lg:top-28">
              <div className="rounded-[1.6rem] border-2 border-ink bg-white shadow-[5px_5px_0_var(--color-shadow)] p-6">
                <h2 className="font-display text-2xl text-ink">
                  Resumo do pedido
                </h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Subtotal</dt>
                    <dd className="text-ink">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Entrega</dt>
                    <dd className="font-bold text-ink">{shippingText(shipping)}</dd>
                  </div>
                  <p className="text-xs font-semibold text-muted">
                    A Siomara combina a entrega consigo pelo WhatsApp.
                  </p>
                  <div className="flex justify-between border-t border-line pt-3 text-base">
                    <dt className="font-medium text-ink">Total</dt>
                    <dd className="font-medium text-ink">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/checkout"
                  className={buttonClasses("primary", "lg", "mt-6 w-full")}
                >
                  Finalizar compra
                </Link>
                <Link
                  href="/loja"
                  className="mt-3 block text-center text-sm font-black underline-offset-4 hover:text-gold-deep hover:underline"
                >
                  Continuar a comprar
                </Link>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}
