"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Check } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCategories } from "@/context/CategoriesContext";
import type { OptionValue } from "@/lib/product-options";

export type Filters = {
  categories: string[];
  brands: string[];
  colors: string[];
  maxPrice: number;
  promoOnly: boolean;
};

export const emptyFilters = (maxPrice: number): Filters => ({
  categories: [],
  brands: [],
  colors: [],
  maxPrice,
  promoOnly: false,
});

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b-2 border-dashed border-ink/15 py-5 first:pt-0">
      <h3 className="mb-3 font-display text-xl text-ink">
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onClick,
  count,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 py-1.5 text-left"
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-md border-2 border-ink transition-colors",
          checked ? "bg-gold text-ink" : "bg-white group-hover:bg-sand",
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
      <span
        className={cn(
          "flex-1 text-sm font-bold transition-colors",
          checked ? "text-ink" : "text-ink/70 group-hover:text-ink",
        )}
      >
        {label}
      </span>
      {typeof count === "number" && (
        <span className="text-xs text-muted/50">{count}</span>
      )}
    </button>
  );
}

export function FilterSidebar({
  filters,
  setFilters,
  brands,
  colors,
  priceBounds,
  categoryCounts,
  brandCounts,
  hideCategories,
  showPromo,
  onClear,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  brands: string[];
  colors: OptionValue[];
  priceBounds: { min: number; max: number };
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
  hideCategories?: boolean;
  showPromo?: boolean;
  onClear: () => void;
}) {
  const categories = useCategories();
  const toggle = (key: "categories" | "brands" | "colors", value: string) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));

  return (
    <div className="flex flex-col">
      {!hideCategories && (
        <FilterGroup title="Categoria">
          <div className="flex flex-col">
            {categories.map((c) => (
              <CheckRow
                key={c.slug}
                label={c.name}
                count={categoryCounts[c.slug]}
                checked={filters.categories.includes(c.slug)}
                onClick={() => toggle("categories", c.slug)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      {brands.length > 0 && (
        <FilterGroup title="Marca">
          <div className="flex flex-col">
            {brands.map((b) => (
              <CheckRow
                key={b}
                label={b}
                count={brandCounts[b]}
                checked={filters.brands.includes(b)}
                onClick={() => toggle("brands", b)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      {colors.length > 0 && (
        <FilterGroup title="Cor do fio">
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c) => {
              const active = filters.colors.includes(c.value);
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggle("colors", c.value)}
                  aria-label={c.value}
                  title={c.value}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 border-ink transition-transform hover:scale-110",
                    active && "ring-4 ring-gold/50",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Preço máximo">
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={500}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
          }
          className="w-full"
          style={{ accentColor: "var(--color-gold)" }}
        />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{formatPrice(priceBounds.min)}</span>
          <span className="font-medium text-ink">
            {formatPrice(filters.maxPrice)}
          </span>
        </div>
      </FilterGroup>

      {showPromo && (
      <FilterGroup title="Promoções">
        <CheckRow
          label="Apenas em promoção"
          checked={filters.promoOnly}
          onClick={() =>
            setFilters((f) => ({ ...f, promoOnly: !f.promoOnly }))
          }
        />
      </FilterGroup>
      )}

      <button
        type="button"
        onClick={onClear}
        className="mt-5 self-start rounded-full border-2 border-ink bg-white px-4 py-1.5 text-sm font-black transition-colors hover:bg-sand"
      >
        Limpar filtros
      </button>
    </div>
  );
}
