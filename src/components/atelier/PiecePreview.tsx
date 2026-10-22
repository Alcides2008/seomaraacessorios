"use client";

import { useId, useMemo, type Ref } from "react";
import { motion } from "framer-motion";
import {
  type Bead,
  type Design,
  type Placed,
  CUSHION,
  GOLD,
  JET,
  LETTER_STYLES,
  LOOP_TOP,
  TAIL_START,
  VIEW,
  buildPiece,
  cordHex,
  layoutLoop,
  layoutStrand,
  shapesFor,
  type Shape,
} from "@/lib/atelier";
import { BOW_PARTS, PATHS } from "@/components/ui/Doodles";

/**
 * Pré-visualização realista da peça (SVG).
 * Pulseiras: na almofada de couro preta, como nas fotos da loja.
 * Fio / porta-chaves: pendurado sobre linho, com doodles na cor de destaque.
 */
export function PiecePreview({
  design,
  ref,
  className,
  animate = true,
}: {
  design: Design;
  ref?: Ref<SVGSVGElement>;
  className?: string;
  animate?: boolean;
}) {
  const p = useId().replace(/[^a-zA-Z0-9]/g, "");
  const style = LETTER_STYLES.find((l) => l.id === design.letterStyle)!;

  const scene = useMemo(() => {
    const shapes = shapesFor(design.type);
    const piece = buildPiece(design);
    return {
      strands: shapes.strands?.map((s, i) => ({ shape: s, placed: layoutStrand(piece.strands![i], s) })),
      loop: shapes.loop ? { shape: shapes.loop, placed: layoutLoop(piece.loop!, shapes.loop) } : null,
      tail: shapes.tail ? { shape: shapes.tail, placed: layoutLoop(piece.tail!, shapes.tail, TAIL_START) } : null,
    };
  }, [design]);

  const cord = cordHex(design.cord);
  const isBracelet = !!scene.strands;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Pré-visualização da peça"
    >
      <Defs p={p} />

      {isBracelet ? <CushionScene p={p} /> : <LinenScene p={p} accent={design.accent} />}

      {/* fio / cordão */}
      {scene.strands?.map(({ shape }, i) => (
        <StrandCord key={i} shape={shape} color={cord} material={design.material} />
      ))}
      {scene.loop && (
        <>
          {design.type === "fio" ? <Lanyard /> : <Clasp p={p} />}
          <path d={pathOf(scene.loop.shape)} fill="none" stroke={JET} strokeWidth="2.5" />
          {scene.tail && <path d={pathOf(scene.tail.shape)} fill="none" stroke={JET} strokeWidth="2.5" />}
          <ellipse cx={VIEW / 2} cy={LOOP_TOP + 2} rx="9" ry="7" fill={JET} />
        </>
      )}

      {/* missangas */}
      <g filter={`url(#${p}-sh)`}>
        {[
          ...(scene.strands?.flatMap((s, si) => s.placed.map((pl, i) => ({ pl, key: `s${si}-${i}` }))) ?? []),
          ...(scene.loop?.placed.map((pl, i) => ({ pl, key: `l${i}` })) ?? []),
          ...(scene.tail?.placed.map((pl, i) => ({ pl, key: `t${i}` })) ?? []),
        ].map(({ pl, key }) => (
          <PlacedBead
            key={`${key}-${pl.bead.id ?? ""}${pl.bead.kind}${pl.bead.char ?? ""}${pl.bead.charm ?? ""}`}
            placed={pl}
            p={p}
            letterBg={style.bg}
            letterFg={style.fg}
            animate={animate}
          />
        ))}
      </g>

      {isBracelet && (
        <text
          x={VIEW / 2}
          y={560}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="19"
          fill="#3b3438"
          opacity=".8"
        >
          Siomara Acessórios
        </text>
      )}
    </svg>
  );
}

/* ---------------- peças da cena ---------------- */

const pathOf = (s: Shape) =>
  s.pts.map((pt, i) => `${i ? "L" : "M"}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" ");

function Defs({ p }: { p: string }) {
  return (
    <defs>
      <radialGradient id={`${p}-shade`} cx=".38" cy=".32" r=".75">
        <stop offset="0" stopColor="#fff" stopOpacity=".85" />
        <stop offset=".35" stopColor="#fff" stopOpacity=".1" />
        <stop offset="1" stopColor="#000" stopOpacity=".28" />
      </radialGradient>
      <radialGradient id={`${p}-pearl`} cx=".36" cy=".3" r=".8">
        <stop offset="0" stopColor="#fff" />
        <stop offset=".4" stopColor="#f5efef" />
        <stop offset=".8" stopColor="#d9cfd3" />
        <stop offset="1" stopColor="#b9adb2" />
      </radialGradient>
      <radialGradient id={`${p}-jet`} cx=".35" cy=".3" r=".8">
        <stop offset="0" stopColor="#77707a" />
        <stop offset=".35" stopColor="#1b1619" />
        <stop offset="1" stopColor="#000" />
      </radialGradient>
      <linearGradient id={`${p}-crystal`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".3" stopColor="#dfe8f1" />
        <stop offset=".5" stopColor="#ffffff" />
        <stop offset=".75" stopColor="#bccad8" />
        <stop offset="1" stopColor="#eef4fa" />
      </linearGradient>
      <linearGradient id={`${p}-metal`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fafafa" />
        <stop offset=".35" stopColor="#a9a9ad" />
        <stop offset=".6" stopColor="#ececee" />
        <stop offset="1" stopColor="#77777c" />
      </linearGradient>
      <linearGradient id={`${p}-cush`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3c3a40" />
        <stop offset=".25" stopColor="#202024" />
        <stop offset="1" stopColor="#0e0e10" />
      </linearGradient>
      <radialGradient id={`${p}-bg`} cx=".5" cy=".35" r=".8">
        <stop offset="0" stopColor="#fbfafa" />
        <stop offset="1" stopColor="#dedadc" />
      </radialGradient>
      <filter id={`${p}-sh`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2.2" stdDeviation="1.8" floodColor="#000" floodOpacity=".38" />
      </filter>
      <filter id={`${p}-grain`}>
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .09 0" />
      </filter>
      <filter id={`${p}-soft`}>
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <clipPath id={`${p}-cushclip`}>
        <path d={CUSHION_D} />
      </clipPath>
    </defs>
  );
}

const { x: CX0, y: CY0, w: CW, h: CH } = CUSHION;
const CUSHION_D = `M${CX0} ${CY0 + 34} Q${CX0} ${CY0} ${CX0 + 40} ${CY0 + 2} L${CX0 + CW - 40} ${CY0 + 2} Q${CX0 + CW} ${CY0} ${CX0 + CW} ${CY0 + 34} L${CX0 + CW + 6} ${CY0 + CH - 40} Q${CX0 + CW + 6} ${CY0 + CH + 2} ${CX0 + CW - 40} ${CY0 + CH} L${CX0 + 40} ${CY0 + CH} Q${CX0 - 6} ${CY0 + CH + 2} ${CX0 - 6} ${CY0 + CH - 40} Z`;

function CushionScene({ p }: { p: string }) {
  return (
    <g>
      <rect width={VIEW} height={VIEW} fill={`url(#${p}-bg)`} />
      <ellipse cx={VIEW / 2} cy={CY0 + CH + 6} rx={CW / 2 + 20} ry="18" fill="#000" opacity=".28" filter={`url(#${p}-soft)`} />
      <path d={CUSHION_D} fill={`url(#${p}-cush)`} />
      <g clipPath={`url(#${p}-cushclip)`}>
        <rect x={CX0 - 10} y={CY0} width={CW + 20} height={CH + 10} filter={`url(#${p}-grain)`} />
        <ellipse cx={VIEW / 2} cy={CY0 + 6} rx={CW / 2} ry="34" fill="#fff" opacity=".07" />
        <rect x={CX0 - 6} y={CY0} width="26" height={CH} fill="#000" opacity=".25" />
        <rect x={CX0 + CW - 20} y={CY0} width="26" height={CH} fill="#000" opacity=".25" />
      </g>
    </g>
  );
}

function LinenScene({ p, accent }: { p: string; accent: string }) {
  const doodles: { d: string | string[]; x: number; y: number; s: number; r: number }[] = [
    { d: BOW_PARTS, x: 52, y: 40, s: 1.6, r: -10 },
    { d: BOW_PARTS, x: 470, y: 470, s: 1.6, r: 12 },
    { d: PATHS.heart, x: 470, y: 120, s: 0.6, r: 10 },
    { d: PATHS.heart, x: 90, y: 330, s: 0.55, r: -12 },
    { d: PATHS.sparkle, x: 455, y: 260, s: 0.55, r: 0 },
    { d: PATHS.sparkle, x: 110, y: 470, s: 0.5, r: 0 },
    { d: PATHS.sparkle, x: 150, y: 150, s: 0.45, r: 0 },
  ];
  return (
    <g>
      <rect width={VIEW} height={VIEW} fill="#e7e2e1" />
      <rect width={VIEW} height={VIEW} filter={`url(#${p}-grain)`} opacity="2" />
      {doodles.map((dd, i) => (
        <g key={i} transform={`translate(${dd.x} ${dd.y}) rotate(${dd.r}) scale(${dd.s})`}>
          {(Array.isArray(dd.d) ? dd.d : [dd.d]).map((d) => (
            <path key={`w${d}`} d={d} fill="#fff" stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
          ))}
          {(Array.isArray(dd.d) ? dd.d : [dd.d]).map((d) => (
            <path key={d} d={d} fill={accent} fillOpacity=".35" stroke={accent} strokeWidth="3" strokeLinejoin="round" />
          ))}
        </g>
      ))}
    </g>
  );
}

function StrandCord({ shape, color, material }: { shape: Shape; color: string; material: string }) {
  const a = shape.pts[0];
  const b = shape.pts[shape.pts.length - 1];
  // as pontas "enrolam" por trás da almofada
  const d = `M${a.x - 16} ${a.y + 10} Q${a.x - 10} ${a.y - 1} ${a.x} ${a.y} ${pathOf(shape).slice(1).replace(/^[^L]*/, "")} Q${b.x + 10} ${b.y - 1} ${b.x + 16} ${b.y + 10}`;
  if (material === "macrame")
    return (
      <g fill="none" strokeLinecap="round">
        <path d={d} stroke="#000" strokeOpacity=".35" strokeWidth="18" />
        <path d={d} stroke={color} strokeWidth="15" />
        <path d={d} stroke="#000" strokeOpacity=".3" strokeWidth="15" strokeDasharray="3 5" />
        <path d={d} stroke="#fff" strokeOpacity=".28" strokeWidth="8" strokeDasharray="5 3" />
      </g>
    );
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="#000" strokeOpacity=".3" strokeWidth="6.5" />
      <path d={d} stroke={color} strokeWidth="5" />
      <path d={d} stroke="#fff" strokeOpacity=".4" strokeWidth="1.4" transform="translate(0 -1.2)" />
    </g>
  );
}

function Lanyard() {
  const cx = VIEW / 2;
  return (
    <g fill="none" strokeLinecap="round">
      <path d={`M${cx} ${LOOP_TOP} C${cx - 34} ${LOOP_TOP - 40} ${cx - 40} ${LOOP_TOP - 112} ${cx} ${LOOP_TOP - 124} C${cx + 40} ${LOOP_TOP - 112} ${cx + 34} ${LOOP_TOP - 40} ${cx} ${LOOP_TOP}`} stroke={JET} strokeWidth="5" />
      <path d={`M${cx - 4} ${LOOP_TOP - 6} C${cx - 30} ${LOOP_TOP - 44} ${cx - 34} ${LOOP_TOP - 108} ${cx} ${LOOP_TOP - 119}`} stroke="#fff" strokeOpacity=".25" strokeWidth="1.2" />
    </g>
  );
}

function Clasp({ p }: { p: string }) {
  const cx = VIEW / 2;
  const m = `url(#${p}-metal)`;
  return (
    <g>
      <circle cx={cx} cy={LOOP_TOP - 6} r="11" fill="none" stroke={m} strokeWidth="4.5" />
      <rect x={cx - 7} y={LOOP_TOP - 50} width="14" height="34" rx="5" fill={m} stroke="#6f6f74" strokeWidth="1" />
      <path
        d={`M${cx} ${LOOP_TOP - 50} C${cx - 26} ${LOOP_TOP - 60} ${cx - 28} ${LOOP_TOP - 112} ${cx - 2} ${LOOP_TOP - 130} C${cx + 16} ${LOOP_TOP - 142} ${cx + 36} ${LOOP_TOP - 124} ${cx + 26} ${LOOP_TOP - 98} L${cx + 16} ${LOOP_TOP - 78}`}
        fill="none"
        stroke={m}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect x={cx + 12} y={LOOP_TOP - 84} width="16" height="7" rx="2" fill={m} stroke="#6f6f74" strokeWidth="1" transform={`rotate(-30 ${cx + 20} ${LOOP_TOP - 80})`} />
    </g>
  );
}

/* ---------------- missangas ---------------- */

function PlacedBead({
  placed,
  p,
  letterBg,
  letterFg,
  animate,
}: {
  placed: Placed;
  p: string;
  letterBg: string;
  letterFg: string;
  animate: boolean;
}) {
  const { x, y, angle, bead, scale = 1 } = placed;
  const body = <BeadBody bead={bead} p={p} letterBg={letterBg} letterFg={letterFg} />;
  if (!animate) return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>{body}</g>;
  return (
    <motion.g
      initial={{ x, y, rotate: angle, scale: 0.2, opacity: 0 }}
      animate={{ x, y, rotate: angle, scale, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      {body}
    </motion.g>
  );
}

const shade = (p: string, r: number) => <circle r={r} fill={`url(#${p}-shade)`} />;

function BeadBody({
  bead,
  p,
  letterBg,
  letterFg,
}: {
  bead: Bead;
  p: string;
  letterBg: string;
  letterFg: string;
}) {
  switch (bead.kind) {
    case "letter":
      return (
        <g>
          <circle r="15" fill={letterBg} stroke="#000" strokeOpacity=".12" />
          {shade(p, 15)}
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Nunito, Arial Rounded MT Bold, Arial, sans-serif"
            fontWeight="900"
            fontSize="16"
            fill={letterFg}
          >
            {bead.char}
          </text>
        </g>
      );
    case "heart":
      return (
        <g>
          <circle r="15" fill="#fff" stroke="#000" strokeOpacity=".12" />
          {shade(p, 15)}
          <path d="M0 7C-8 2-9-4-5.5-6.5-2.8-8.4-.8-6.3 0-4.8.8-6.3 2.8-8.4 5.5-6.5 9-4 8 2 0 7z" fill="#d6283b" />
        </g>
      );
    case "smile":
      return (
        <g>
          <circle r="15" fill="#fff" stroke="#000" strokeOpacity=".12" />
          {shade(p, 15)}
          <circle cx="-5" cy="-3" r="1.8" fill="#1c1418" />
          <circle cx="5" cy="-3" r="1.8" fill="#1c1418" />
          <path d="M-6 3Q0 9 6 3" fill="none" stroke="#1c1418" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      );
    case "eye":
      return <EyeBead p={p} r={15} />;
    case "star":
      return (
        <g>
          <path d={starPath(16, 7.4)} fill={bead.color ?? "#ff4f9a"} stroke="#000" strokeOpacity=".2" strokeLinejoin="round" />
          <path d={starPath(9, 4.2)} fill="#fff" />
          <path d={starPath(16, 7.4)} fill={`url(#${p}-shade)`} opacity=".7" />
        </g>
      );
    case "pearl":
      return <circle r="12" fill={`url(#${p}-pearl)`} />;
    case "black":
      return (
        <g>
          <circle r="12" fill={`url(#${p}-jet)`} />
          <ellipse cx="-4" cy="-5" rx="3.2" ry="2" fill="#fff" opacity=".85" transform="rotate(-30 -4 -5)" />
        </g>
      );
    case "crystal":
      return (
        <g opacity=".95">
          <path d={polygon(8, 10.5)} fill={`url(#${p}-crystal)`} stroke="#9fb0c2" strokeWidth=".8" />
          <path d="M-10 0H10M0-10V10M-7-7 7 7M-7 7 7-7" stroke="#fff" strokeOpacity=".7" strokeWidth=".7" />
          <circle cx="-3" cy="-4" r="2" fill="#fff" />
        </g>
      );
    case "seed":
      return (
        <g>
          <circle r="5.5" fill={bead.color ?? GOLD} opacity=".95" />
          <circle cx="-1.8" cy="-1.8" r="1.6" fill="#fff" opacity=".7" />
        </g>
      );
    case "charm":
      return <Charm id={bead.charm!} p={p} />;
  }
}

function EyeBead({ p, r }: { p: string; r: number }) {
  return (
    <g>
      <circle r={r} fill="#1f4fd1" />
      <circle r={r * 0.66} fill="#fff" />
      <circle r={r * 0.46} fill="#56bdf0" />
      <circle r={r * 0.24} fill="#0b0b10" />
      {shade(p, r)}
    </g>
  );
}

function Charm({ id, p }: { id: string; p: string }) {
  const m = `url(#${p}-metal)`;
  switch (id) {
    case "infinito":
      return (
        <g fill="none" strokeLinecap="round">
          <path d="M0 0C-8-12-27-12-27 0S-8 12 0 0 27-12 27 0 8 12 0 0Z" stroke="#5f5f64" strokeWidth="7.5" />
          <path d="M0 0C-8-12-27-12-27 0S-8 12 0 0 27-12 27 0 8 12 0 0Z" stroke={m} strokeWidth="5.5" />
          <path d="M0 0C-8-12-27-12-27 0S-8 12 0 0 27-12 27 0 8 12 0 0Z" stroke="#fff" strokeOpacity=".6" strokeWidth="1.2" strokeDasharray="1.5 2.5" />
        </g>
      );
    case "ancora":
      return (
        <g fill="none" stroke={m} strokeWidth="3.6" strokeLinecap="round" transform="rotate(90)">
          <circle cy="-15" r="4" />
          <path d="M0-11V16M-8-5H8M-14 5Q-12 17 0 16 12 17 14 5M-14 5l-3 4M14 5l3 4" />
        </g>
      );
    case "cruz":
      return (
        <path d="M-3-17h6v8h9v6h-9v19h-6V-3h-9v-6h9z" fill={m} stroke="#6b6b70" strokeWidth=".8" transform="rotate(90)" />
      );
    case "coracao":
      return (
        <g>
          <path d="M0 15C-15 5-17-6-10.5-11.5-5-15.5-1-11.5 0-8.5 1-11.5 5-15.5 10.5-11.5 17-6 15 5 0 15z" fill="#e0233f" stroke={m} strokeWidth="2.6" />
          <ellipse cx="-6" cy="-6" rx="3" ry="2" fill="#fff" opacity=".6" />
        </g>
      );
    case "yinyang":
      return (
        <g>
          <circle r="17" fill="#fff" stroke={m} strokeWidth="3" />
          <path d="M0-15.5A15.5 15.5 0 0 1 0 15.5 7.75 7.75 0 0 1 0 0 7.75 7.75 0 0 0 0-15.5Z" fill="#111" />
          <circle cy="-7.75" r="2.4" fill="#fff" />
          <circle cy="7.75" r="2.4" fill="#111" />
        </g>
      );
    case "olho":
      return <EyeBead p={p} r={19} />;
    default:
      return null;
  }
}

function starPath(R: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r : R;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(rad * Math.cos(a)).toFixed(2)} ${(rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

function polygon(n: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((Math.PI * 2) / n) * i + Math.PI / n;
    pts.push(`${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}
