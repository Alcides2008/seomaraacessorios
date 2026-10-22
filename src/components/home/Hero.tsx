"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { PiecePreview } from "@/components/atelier/PiecePreview";
import { BowDoodle, HeartDoodle, SparkleDoodle, StarDoodle, Shine, Squiggle } from "@/components/ui/Doodles";
import { cn } from "@/lib/utils";
import { EASE_PREMIUM } from "@/lib/motion";
import { DEFAULT_DESIGN, TYPES, toBeadText, designToQuery, type Design, type PieceType } from "@/lib/atelier";
import { getSiteContent, defaultContent, type HeroSlide } from "@/lib/content";

// cada peça com o seu "look" na montra do hero
const LOOKS: Record<PieceType, Partial<Design>> = {
  pulseira: { preset: "estrelas", accent: "#ff4f9a", cord: "preto" },
  casal: { preset: "minimal", cord: "vermelho", material: "cetim", heart: true },
  fio: { preset: "perolas", accent: "#ff4f9a" },
  chaves: { preset: "estrelas", accent: "#9b5cc9", charm: "coracao" },
};

const FLOATERS = [
  { el: <SparkleDoodle size={40} />, top: "6%", left: "2%", r: -12 },
  { el: <HeartDoodle size={34} />, top: "80%", left: "1%", r: 10 },
  { el: <StarDoodle size={30} />, top: "3%", left: "45%", r: 14 },
  { el: <HeartDoodle size={26} fill="var(--color-lilac)" />, top: "92%", left: "40%", r: -8 },
];

export function Hero() {
  const [copy, setCopy] = useState<HeroSlide>(defaultContent.hero[0]);
  const [name, setName] = useState("SIOMARA");
  const [type, setType] = useState<PieceType>("pulseira");
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    getSiteContent()
      .then((c) => c.hero[0] && setCopy(c.hero[0]))
      .catch(() => {});
  }, []);

  // montra: troca de peça sozinha até a pessoa escolher uma
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(
      () => setType((cur) => TYPES[(TYPES.findIndex((x) => x.id === cur) + 1) % TYPES.length].id),
      3800,
    );
    return () => clearInterval(t);
  }, [auto]);

  const max = TYPES.find((t) => t.id === type)!.maxLetters;
  const design: Design = {
    ...DEFAULT_DESIGN,
    ...LOOKS[type],
    type,
    name: name.slice(0, max) || "♥",
    name2: type === "casal" ? "AMOR" : type === "chaves" ? "LOVE" : "",
  };
  const lines = copy.title.split("\n");

  return (
    <section className="relative overflow-hidden pb-20 pt-8 md:pb-28 md:pt-14">
      {/* fundo: caderno quadriculado + manchas de cor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-champagne/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 h-[28rem] w-[28rem] rounded-full bg-lilac/50 blur-3xl" />

      {FLOATERS.map((s, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute hidden sm:block"
          style={{ top: s.top, left: s.left }}
          animate={{ y: [0, -10, 0], rotate: [s.r, s.r + 10, s.r] }}
          transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {s.el}
        </motion.span>
      ))}

      <div className="container-siomara relative grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        {/* ---------- texto ---------- */}
        <div>
          <motion.span
            initial={{ opacity: 0, rotate: -8, y: 10 }}
            animate={{ opacity: 1, rotate: -3, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_PREMIUM }}
            className="sticker inline-flex items-center gap-2 rounded-full bg-butter px-4 py-1 font-hand text-2xl font-bold text-ink"
          >
            <Shine size={18} />
            {copy.eyebrow}
          </motion.span>

          <h1 className="mt-6 font-script text-[3.6rem] font-normal leading-[1.05] tracking-normal text-ink sm:text-7xl lg:text-[6rem]">
            {lines.map((line, i) => {
              const last = i === lines.length - 1;
              return (
                // padding extra: as voltas da caligrafia não podem ser cortadas pelo overflow da animação
                <span key={i} className="block overflow-hidden px-2 pb-4 pt-1">
                  <motion.span
                    className={cn("relative inline-block", last && "text-gold-deep")}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: EASE_PREMIUM, delay: 0.1 + i * 0.12 }}
                  >
                    {line}
                    {last && <Squiggle className="absolute -bottom-2 left-0 h-3 w-full text-ink" />}
                  </motion.span>
                </span>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-md text-lg font-semibold leading-relaxed text-muted"
          >
            {copy.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-8 max-w-md"
          >
            <label htmlFor="hero-nome" className="font-hand text-2xl font-bold text-ink">
              Escreva um nome e veja ao lado ✦
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="hero-nome"
                value={name}
                onChange={(e) => setName(toBeadText(e.target.value, 12))}
                placeholder="O SEU NOME"
                autoComplete="off"
                className="sticker h-14 w-full rounded-full bg-white px-6 text-lg font-black uppercase tracking-[0.2em] text-ink placeholder:text-ink/30 focus:outline-none focus:ring-4 focus:ring-gold/40"
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/criar?${designToQuery(design)}`}
                className={buttonClasses("primary", "lg")}
              >
                Abrir o Atelier
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href={copy.ctaHref} className={buttonClasses("outline", "lg")}>
                {copy.ctaLabel}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ---------- montra ao vivo ---------- */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <motion.div
            initial={{ opacity: 0, rotate: 6, y: 30 }}
            animate={{ opacity: 1, rotate: 2, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_PREMIUM, delay: 0.2 }}
            className="sticker-lg overflow-hidden rounded-[2.2rem] bg-white"
          >
            <PiecePreview design={design} className="block h-auto w-full" />
          </motion.div>

          {/* separadores de peça */}
          <div className="relative z-10 -mt-6 flex flex-wrap justify-center gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setAuto(false);
                  setType(t.id);
                }}
                className={cn(
                  "rounded-full border-2 border-ink px-3.5 py-1.5 text-xs font-black transition-all",
                  type === t.id ? "bg-gold shadow-[3px_3px_0_var(--color-ink)]" : "bg-white hover:bg-sand",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <motion.div
            className="absolute -left-6 -top-6"
            animate={{ rotate: [-16, -6, -16] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <BowDoodle size={92} />
          </motion.div>
          <motion.div
            className="sticker absolute -right-3 top-10 rounded-2xl bg-gold px-4 py-1.5 text-ink"
            animate={{ rotate: [8, 3, 8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-hand text-2xl font-bold">ao vivo ✦</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
