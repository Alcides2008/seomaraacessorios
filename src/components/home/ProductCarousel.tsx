"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductCarousel({
  eyebrow,
  title,
  products,
  viewAll,
}: {
  eyebrow?: string;
  title: string;
  products: Product[];
  viewAll?: { label: string; href: string };
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            align="left"
            className="flex-1"
          />
          <div className="hidden gap-2 md:flex">
            <CarouselButton dir="left" onClick={() => scroll("left")} />
            <CarouselButton dir="right" onClick={() => scroll("right")} />
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[23%]"
            />
          ))}
        </div>

        {viewAll && (
          <div className="mt-8 flex justify-center md:hidden">
            <a
              href={viewAll.href}
              className="tracking-luxe text-xs uppercase text-ink underline-offset-4 hover:text-gold hover:underline"
            >
              {viewAll.label}
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}

function CarouselButton({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Anterior" : "Seguinte"}
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[3px_3px_0_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-gold"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
