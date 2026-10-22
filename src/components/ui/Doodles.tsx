import { cn } from "@/lib/utils";

/**
 * Doodles em autocolante — os mesmos laços, corações, brilhos e "traços de
 * brilho" que a Siomara desenha por cima das fotos dos produtos.
 * Contorno preto + halo branco, recheio na cor pedida.
 */

type DoodleProps = {
  size?: number;
  fill?: string;
  className?: string;
};

export const PATHS = {
  heart:
    "M32 54S8 40 8 23c0-8 6-13 12-13 5 0 9 3 12 7 3-4 7-7 12-7 6 0 12 5 12 13 0 17-24 31-24 31z",
  sparkle:
    "M32 4c2 15 10 24 26 28-16 4-24 13-26 28-2-15-10-24-26-28C22 28 30 19 32 4z",
  star: "M32 5l8 17 18 2-13 13 4 19-17-9-17 9 4-19L6 24l18-2z",
};

function Sticker({
  d,
  size = 48,
  fill = "#fff",
  className,
}: DoodleProps & { d: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <path d={d} fill="#fff" stroke="#fff" strokeWidth="10" strokeLinejoin="round" />
      <path d={d} fill={fill} stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export const HeartDoodle = (p: DoodleProps) => (
  <Sticker d={PATHS.heart} fill="var(--color-gold)" {...p} />
);
export const SparkleDoodle = (p: DoodleProps) => (
  <Sticker d={PATHS.sparkle} fill="var(--color-butter)" {...p} />
);
export const StarDoodle = (p: DoodleProps) => (
  <Sticker d={PATHS.star} fill="var(--color-sky)" {...p} />
);

export const BOW_PARTS = [
  "M30 27C22 14 6 10 5 20c-1 9 13 12 25 9z",
  "M34 27c8-13 24-17 25-7 1 9-13 12-25 9z",
  "M29 31c-3 9-8 18-12 26l7-2 3 6c3-10 5-20 6-29z",
  "M35 31c3 9 8 18 12 26l-7-2-3 6c-3-10-5-20-6-29z",
];

/** Laço em contorno, como nos cantos das fotos. */
export function BowDoodle({ size = 64, fill = "var(--color-champagne)", className }: DoodleProps) {
  const parts = BOW_PARTS;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className={cn("overflow-visible", className)}>
      {parts.map((d) => (
        <path key={d} d={d} fill="#fff" stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
      ))}
      {parts.map((d) => (
        <path key={`i${d}`} d={d} fill={fill} stroke="var(--color-ink)" strokeWidth="2.6" strokeLinejoin="round" />
      ))}
      <path d="M27 27a5 5 0 1 0 10 0 5 5 0 1 0-10 0" fill="var(--color-gold)" stroke="var(--color-ink)" strokeWidth="2.6" />
    </svg>
  );
}

/** Os três traços de "brilho" (( ✦ )) dos stories. */
export function Shine({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden className={className}>
      <g stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round">
        <path d="M6 18 2 20" />
        <path d="M8 10 4 6" />
        <path d="M16 7V2" />
      </g>
    </svg>
  );
}

/** Sublinhado em rabisco para destacar uma palavra. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden className={className}>
      <path
        d="M2 10c18-8 30 6 48-1s30-7 48 0 30 7 48 0 30-7 52 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
