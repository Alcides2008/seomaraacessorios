import { cn } from "@/lib/utils";

/**
 * Motivos da marca: missangas com letras (como as pulseiras da Siomara),
 * estrelas, pérolas, brilho e o laço do logótipo.
 */

/** Uma missanga redonda com letra. */
export function LetterBead({
  char,
  size = 36,
  className,
}: {
  char: string;
  size?: number;
  className?: string;
}) {
  if (char === "♥") return <HeartBead size={size} className={className} />;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-pearl font-sans font-semibold text-ink",
        "shadow-[inset_0_-3px_0_rgba(58,31,43,0.10),0_2px_4px_rgba(58,31,43,0.18)]",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.46 }}
    >
      {char}
    </span>
  );
}

function HeartBead({ size, className }: { size: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-pearl text-[#d62e45]",
        "shadow-[inset_0_-3px_0_rgba(58,31,43,0.10),0_2px_4px_rgba(58,31,43,0.18)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} aria-hidden>
        <path
          fill="currentColor"
          d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4.5 6 4.5c2.2 0 3.5 1.2 4.3 2.4h3.4c.8-1.2 2.1-2.4 4.3-2.4 3.8 0 5.7 3.9 4 7.2C19.5 16.4 12 21 12 21z"
        />
      </svg>
    </span>
  );
}

/** Palavra em missangas: "SIOMARA" → ⓢⓘⓞⓜⓐⓡⓐ. */
export function BeadWord({
  word,
  size = 36,
  gap = 3,
  className,
}: {
  word: string;
  size?: number;
  gap?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex flex-wrap items-center", className)}
      style={{ gap }}
      aria-label={word}
    >
      {[...word.toUpperCase()].map((ch, i) =>
        ch === " " ? (
          <span key={i} style={{ width: size / 3 }} />
        ) : (
          <LetterBead key={i} char={ch} size={size} />
        ),
      )}
    </span>
  );
}


/** Estrela de missanga (contorno colorido, miolo branco). */
export function StarBead({
  size = 30,
  color = "var(--color-gold)",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("shrink-0 drop-shadow-[0_2px_2px_rgba(58,31,43,0.2)]", className)}
    >
      <path
        d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6 5.6 21.1 7 14l-5.3-5 7.2-.9z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.2l1.6 3.3 3.6.5-2.6 2.5.6 3.6L12 15.4l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z"
        fill="#fff"
      />
    </svg>
  );
}

/** Pérola / missanga lisa. */
export function Pearl({
  size = 22,
  color = "#fff",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, #fff 0 18%, ${color} 45%, color-mix(in srgb, ${color} 70%, #3a1f2b) 100%)`,
        boxShadow: "0 2px 3px rgba(58,31,43,0.18)",
      }}
    />
  );
}

