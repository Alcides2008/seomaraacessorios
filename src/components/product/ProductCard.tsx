"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { productCover } from "@/lib/product-options";
import { useCategories } from "@/context/CategoriesContext";
import { useWishlist } from "@/context/WishlistContext";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-edge bg-gold px-2.5 py-0.5 text-[11px] font-semibold text-ink">
      {children}
    </span>
  );
}

/** Cartão de produto para grelhas e carrosséis. */
export function ProductCard({
  product,
  className,
  onQuickView,
}: {
  product: Product;
  className?: string;
  /** Se fornecido, mostra o botão de vista rápida (catálogo). */
  onQuickView?: (product: Product) => void;
}) {
  const { slug, name, brand, price, compareAtPrice, category, isNew, bestseller } =
    product;
  const discount = compareAtPrice
    ? Math.round((1 - price / compareAtPrice) * 100)
    : 0;
  const categories = useCategories();
  const categoryName = categories.find((c) => c.slug === category)?.name ?? "";

  const { has, toggle } = useWishlist();
  const isFav = has(product.id);

  const handleQuickView = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  // inclinação "de autocolante" estável por produto
  const tilt = "";

  return (
    <Link
      href={`/produto/${slug}`}
      className={cn(
        "group block rounded-2xl border border-edge bg-white p-2.5 shadow-[0_12px_32px_-22px_rgba(59,34,48,0.35)] transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(59,34,48,0.45)]",
        tilt,
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-premium group-hover:scale-110"
          style={{ backgroundImage: productCover(product) }}
        />

        {/* badges */}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5">
          {discount > 0 && <Badge>-{discount}%</Badge>}
          {isNew && <Badge>Novo</Badge>}
          {!isNew && bestseller && <Badge>Top ♥</Badge>}
        </div>

        {/* ações no canto */}
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-white transition-transform hover:scale-110",
              isFav && "bg-gold",
            )}
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`Vista rápida de ${name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-white opacity-0 transition-all group-hover:opacity-100 max-lg:opacity-100"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* preço em autocolante */}
        <span className="absolute -bottom-0.5 right-2 rounded-full border border-edge bg-butter px-3 py-1 text-sm font-semibold text-ink shadow-[0_12px_32px_-22px_rgba(59,34,48,0.35)] transition-transform">
          {formatPrice(price)}
        </span>
      </div>

      {/* info */}
      <div className="flex flex-col gap-0.5 px-1.5 pb-1.5 pt-3">
        {brand && <span className="text-[10px] font-bold uppercase text-muted">{brand}</span>}
        <span className="font-hand text-lg leading-none text-gold-deep">{categoryName}</span>
        <h3 className="font-sans text-[15px] font-semibold leading-snug text-ink">{name}</h3>
        {compareAtPrice && (
          <span className="text-xs text-muted line-through">{formatPrice(compareAtPrice)}</span>
        )}
      </div>
    </Link>
  );
}
