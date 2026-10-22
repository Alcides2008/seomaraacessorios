"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Heart, HandHeart, MessageCircleHeart, Wand2 } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { productOptions, nameFields, ATELIER_TYPE } from "@/lib/product-options";
import { DEFAULT_DESIGN, designToQuery, toBeadText } from "@/lib/atelier";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { buttonClasses } from "@/components/ui/Button";
import { BeadWord } from "@/components/ui/Beads";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { whatsappUrl } from "@/lib/whatsapp";
import { ShareButtons } from "./ShareButtons";

export function ProductDetail({
  product,
  categoryName,
}: {
  product: Product;
  categoryName: string;
}) {
  const router = useRouter();
  const options = productOptions(product);
  const fields = nameFields(product);
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const isFav = wishlist.has(product.id);

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((g) => [g.label, g.values[0].value])),
  );
  const [names, setNames] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tried, setTried] = useState(false);

  const missing = fields.filter((f) => !f.optional && !names[f.key]?.trim());
  const atelierType = ATELIER_TYPE[product.category];
  const atelierHref =
    atelierType &&
    `/criar?${designToQuery({
      ...DEFAULT_DESIGN,
      type: atelierType,
      name: names[fields[0]?.key] ?? DEFAULT_DESIGN.name,
      name2: names[fields[1]?.key] ?? "",
    })}`;

  // o que vai para o carrinho / encomenda: cor + nomes preenchidos
  const lineOptions = () => {
    const o: Record<string, string> = { ...selected };
    for (const f of fields) if (names[f.key]?.trim()) o[f.key] = names[f.key].trim();
    return Object.keys(o).length ? o : undefined;
  };

  const add = (then?: () => void) => {
    if (missing.length) {
      setTried(true);
      return;
    }
    addItem(product, qty, lineOptions());
    then?.();
  };
  const addToCart = () =>
    add(() => {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    });
  const buyNow = () => add(() => router.push("/checkout"));

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col">
      <span className="font-hand text-2xl font-bold text-gold-deep">{categoryName}</span>
      <h1 className="mt-1 text-4xl text-ink md:text-5xl">{product.name}</h1>

      {/* Preço em autocolante */}
      <div className="mt-5 flex items-center gap-3">
        <span className="rotate-[-3deg] rounded-full border-2 border-ink bg-butter px-5 py-1.5 font-display text-2xl font-black text-ink shadow-[3px_3px_0_var(--color-ink)]">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <>
            <span className="text-base font-bold text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="rounded-full border-2 border-ink bg-gold px-2.5 py-0.5 text-xs font-black">
              -{discount}%
            </span>
          </>
        )}
      </div>

      <p className="mt-6 text-base font-semibold leading-relaxed text-ink/70">{product.description}</p>

      {/* ---------- Personalização ---------- */}
      {fields.length > 0 && (
        <div className="mt-8 rounded-[1.6rem] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--color-ink)]">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl">Personalize</h2>
            <span className="font-hand text-xl text-gold-deep">feito com o seu nome ✦</span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {fields.map((f) => {
              const value = names[f.key] ?? "";
              const error = tried && !f.optional && !value.trim();
              return (
                <label key={f.key} className="block">
                  <span className="mb-1.5 flex items-baseline justify-between text-sm font-bold">
                    {f.label}
                    <span className="text-xs text-ink/50">
                      {value.length}/{f.max}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <input
                      value={value}
                      onChange={(e) =>
                        setNames((n) => ({ ...n, [f.key]: toBeadText(e.target.value, f.max, f.spaces) }))
                      }
                      placeholder={f.optional ? "OPCIONAL" : "ESCREVA AQUI"}
                      maxLength={f.max}
                      autoComplete="off"
                      aria-invalid={error}
                      className={cn(
                        "h-12 w-full rounded-full border-2 bg-sand px-5 font-black uppercase tracking-[0.18em] text-ink placeholder:text-ink/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold/40",
                        error ? "border-gold-deep" : "border-ink",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setNames((n) => ({ ...n, [f.key]: toBeadText((n[f.key] ?? "") + "♥", f.max, f.spaces) }))
                      }
                      aria-label={`Acrescentar coração em ${f.label}`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-gold text-lg transition-transform hover:rotate-12 hover:scale-110"
                    >
                      ♥
                    </button>
                  </div>
                  {error && (
                    <span className="mt-1 block text-xs font-bold text-gold-deep">
                      Escreva o texto para a peça.
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {/* pré-visualização das letras */}
          <div className="mt-5 flex min-h-12 flex-col gap-2 rounded-2xl border-2 border-dashed border-ink/25 bg-cream p-3">
            <span className="text-xs font-bold text-ink/50">Assim fica:</span>
            <AnimatePresence mode="popLayout">
              {fields
                .filter((f) => names[f.key])
                .map((f) => (
                  <motion.div
                    key={f.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <BeadWord word={names[f.key]} size={28} gap={2} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {atelierHref && (
            <Link
              href={atelierHref}
              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-gold-deep underline-offset-4 hover:underline"
            >
              <Wand2 className="h-4 w-4" />
              Quer mudar cores, estrelas e pingentes? Abrir no Atelier
            </Link>
          )}
        </div>
      )}

      {/* Opções (cor do fio) */}
      {options.map((group) => (
        <div key={group.label} className="mt-7">
          <div className="flex items-center gap-2 text-sm font-bold">
            {group.label === "Cor" ? "Cor do fio" : group.label}
            <span className="font-semibold text-ink/50">· {selected[group.label]}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {group.values.map((v) => {
              const isSel = selected[group.label] === v.value;
              return group.type === "color" ? (
                <button
                  key={v.value}
                  onClick={() => setSelected((s) => ({ ...s, [group.label]: v.value }))}
                  aria-label={v.value}
                  aria-pressed={isSel}
                  title={v.value}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 border-ink transition-transform hover:scale-110",
                    isSel && "scale-110 shadow-[3px_3px_0_var(--color-ink)] ring-4 ring-gold/50",
                  )}
                  style={{ backgroundColor: v.hex }}
                />
              ) : (
                <button
                  key={v.value}
                  onClick={() => setSelected((s) => ({ ...s, [group.label]: v.value }))}
                  className={cn(
                    "min-w-12 rounded-full border-2 border-ink px-4 py-2 text-sm font-black transition-colors",
                    isSel ? "bg-ink text-cream" : "bg-white hover:bg-sand",
                  )}
                >
                  {v.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Stock + favoritos */}
      <div className="mt-7 flex flex-wrap items-center gap-4 text-sm font-bold">
        <span className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", product.inStock ? "bg-emerald-500" : "bg-red-400")} />
          {product.inStock ? "Disponível por encomenda" : "Esgotado"}
        </span>
        <button
          onClick={() => wishlist.toggle(product)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 transition-colors",
            isFav ? "bg-gold" : "bg-white hover:bg-sand",
          )}
        >
          <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
          {isFav ? "Nos favoritos" : "Favoritos"}
        </button>
      </div>

      {/* Quantidade + ações */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center self-start rounded-full border-2 border-ink bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Diminuir"
            className="flex h-12 w-12 items-center justify-center text-ink hover:text-gold-deep"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-black">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Aumentar"
            className="flex h-12 w-12 items-center justify-center text-ink hover:text-gold-deep"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button onClick={addToCart} disabled={!product.inStock} className={buttonClasses("primary", "lg", "flex-1")}>
          {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
        </button>
        <button onClick={buyNow} disabled={!product.inStock} className={buttonClasses("gold", "lg", "flex-1")}>
          Comprar já
        </button>
      </div>
      {tried && missing.length > 0 && (
        <p role="alert" className="mt-2 text-sm font-bold text-gold-deep">
          Falta escrever: {missing.map((f) => f.label.toLowerCase()).join(" e ")}.
        </p>
      )}

      {/* Garantias */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-mint p-4">
          <HandHeart className="h-6 w-6 shrink-0" />
          <span className="text-sm font-bold">Feito à mão depois da sua encomenda</span>
        </div>
        <a
          href={whatsappUrl(`Olá Siomara! Tenho uma dúvida sobre: ${product.name}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-sky p-4 transition-transform hover:-translate-y-0.5"
        >
          <MessageCircleHeart className="h-6 w-6 shrink-0" />
          <span className="text-sm font-bold">
            Dúvidas? Fale com a Siomara <WhatsAppIcon className="inline h-4 w-4" />
          </span>
        </a>
      </div>

      <div className="mt-8 border-t-2 border-dashed border-ink/20 pt-6">
        <ShareButtons title={`${product.name} — ${categoryName} · Siomara Acessórios`} />
      </div>
    </div>
  );
}
