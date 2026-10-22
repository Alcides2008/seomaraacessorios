"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { BowDoodle, HeartDoodle, SparkleDoodle } from "@/components/ui/Doodles";
import { EASE_PREMIUM } from "@/lib/motion";
import { getSiteContent, defaultContent, type PromoContent } from "@/lib/content";

// colagem de "polaroids" com fotos reais
const POLAROIDS = [
  { src: "/products/s20261021-59.jpg", rot: -8, x: "0%", y: "6%", note: "casal ♥" },
  { src: "/products/s20261021-76.jpg", rot: 6, x: "34%", y: "0%", note: "fio rosa" },
  { src: "/products/s20261022-22.jpg", rot: -3, x: "16%", y: "44%", note: "MARA ✦" },
];

export function PromoBanner() {
  const [promo, setPromo] = useState<PromoContent>(defaultContent.promo);

  useEffect(() => {
    getSiteContent()
      .then((c) => setPromo(c.promo))
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] border-[2.5px] border-ink bg-linear-to-br from-lilac via-champagne to-gold p-8 shadow-[8px_8px_0_var(--color-shadow)] md:grid-cols-2 md:p-14">
          <SparkleDoodle size={46} className="absolute right-6 top-6" />

          <div className="relative z-10">
            <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-white px-4 py-1 font-hand text-2xl font-bold">
              {promo.eyebrow}
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_PREMIUM }}
              className="mt-5 text-4xl text-ink md:text-6xl"
            >
              {promo.title}
            </motion.h2>
            <p className="mt-5 max-w-md text-lg font-bold text-ink/75">{promo.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/criar" className={buttonClasses("outline", "lg")}>
                Criar no Atelier ✦
              </Link>
              <Link href={promo.ctaHref} className={buttonClasses("gold", "lg")}>
                {promo.ctaLabel}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md">
            {POLAROIDS.map((p, i) => (
              <motion.div
                key={p.src}
                initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, rotate: p.rot, scale: 1 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.12 }}
                className="absolute w-[56%] rounded-xl border-2 border-ink bg-white p-2.5 pb-9 shadow-[5px_5px_0_var(--color-shadow)]"
                style={{ left: p.x, top: p.y }}
              >
                <div className="aspect-square rounded-md bg-cover bg-center" style={{ backgroundImage: `url("${p.src}")` }} />
                <span className="absolute bottom-1.5 left-0 right-0 text-center font-hand text-xl font-bold">
                  {p.note}
                </span>
              </motion.div>
            ))}
            <BowDoodle size={70} className="absolute -left-2 bottom-2 z-20 -rotate-12" />
            <HeartDoodle size={36} className="absolute right-2 top-1/2 z-20" />
          </div>
        </div>
      </Container>
    </section>
  );
}
