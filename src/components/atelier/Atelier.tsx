"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Check,
  CircleDot,
  Dices,
  Heart,
  KeyRound,
  Link2,
  ShoppingBag,
  Smartphone,
  Trash2,
  Undo2,
  Wand2,
  X,
} from "lucide-react";
import {
  ACCENTS,
  CHARMS,
  CORDS,
  DEFAULT_DESIGN,
  DEFAULT_PRICES,
  GOLD,
  JET,
  LETTER_STYLES,
  MILK,
  PRESETS,
  TYPES,
  beadSize,
  buildPiece,
  designFromQuery,
  designOptions,
  designPrice,
  designTitle,
  designToQuery,
  shapesFor,
  toBeadText,
  type Bead,
  type CharmId,
  type Design,
  type PieceType,
} from "@/lib/atelier";
import { PiecePreview } from "./PiecePreview";
import { getAtelierPrices } from "@/lib/atelier-prices";
import { LetterBead, Pearl, StarBead } from "@/components/ui/Beads";
import { HeartDoodle, SparkleDoodle } from "@/components/ui/Doodles";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { buttonClasses } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const TYPE_ICON: Record<PieceType, ReactNode> = {
  pulseira: <CircleDot className="h-6 w-6" />,
  casal: <Heart className="h-6 w-6" />,
  fio: <Smartphone className="h-6 w-6" />,
  chaves: <KeyRound className="h-6 w-6" />,
};

const CATEGORY_OF: Record<PieceType, string> = {
  pulseira: "pulseiras",
  casal: "casal",
  fio: "fios-telemovel",
  chaves: "porta-chaves",
};

let uid = 0;
const withIds = (list: Bead[]) => list.map((b) => ({ ...b, id: `b${++uid}` }));

export function Atelier({ initialQuery }: { initialQuery: string }) {
  const [d, setD] = useState<Design>(() =>
    initialQuery ? designFromQuery(new URLSearchParams(initialQuery)) : DEFAULT_DESIGN,
  );
  const [history, setHistory] = useState<Bead[][]>([]);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState((process.env.NEXT_PUBLIC_SITE_URL ?? "").trim());
  const svgRef = useRef<SVGSVGElement>(null);
  const { addItem } = useCart();

  const type = TYPES.find((t) => t.id === d.type)!;
  const [prices, setPrices] = useState(DEFAULT_PRICES);
  useEffect(() => {
    getAtelierPrices().then(setPrices);
  }, []);
  const price = designPrice(d, prices);
  const query = designToQuery(d);

  // o design vive no URL → link partilhável
  useEffect(() => {
    window.history.replaceState(null, "", `/criar?${query}`);
  }, [query]);
  useEffect(() => setOrigin(window.location.origin), []);

  const set = (patch: Partial<Design>) => setD((prev) => ({ ...prev, ...patch }));

  const setType = (t: PieceType) =>
    setD((prev) => {
      const max = TYPES.find((x) => x.id === t)!.maxLetters;
      return {
        ...prev,
        type: t,
        name: prev.name.slice(0, max),
        name2: t === "chaves" ? prev.name2.slice(0, 6) : prev.name2.slice(0, max),
        custom: null,
      };
    });

  /* ---------- modo livre ---------- */
  const startFree = () => {
    const piece = buildPiece(d);
    set({ custom: withIds(piece.strands?.[0] ?? piece.loop ?? []) });
    setHistory([]);
  };
  const editCustom = (next: Bead[]) => {
    if (d.custom) setHistory((h) => [...h.slice(-30), d.custom!]);
    set({ custom: next });
  };
  const addBead = (b: Bead) => editCustom([...(d.custom ?? []), ...withIds([b])]);
  const undo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    set({ custom: prev });
  };

  const capacity = useMemo(() => {
    const s = shapesFor(d.type);
    const shape = s.strands?.[0] ?? s.loop!;
    const room = s.loop ? shape.length - 28 : shape.length;
    const used = (d.custom ?? []).reduce((sum, b) => sum + beadSize(b) + 2, 0);
    return Math.round((used / room) * 100);
  }, [d.type, d.custom]);

  /* ---------- surpresa ---------- */
  const surprise = () => {
    const r = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];
    set({
      cord: r(CORDS).id,
      material: r<Design["material"]>(["cetim", "macrame"]),
      preset: r(PRESETS).id,
      accent: r(ACCENTS).hex,
      charm: r(CHARMS).id,
      letterStyle: r(LETTER_STYLES).id,
      custom: null,
    });
  };

  /* ---------- encomendar ---------- */
  const shareUrl = () => `${origin}/criar?${query}`;

  const addToCart = () => {
    const svg = svgRef.current?.outerHTML ?? "";
    const product: Product = {
      id: `atelier-${d.type}`,
      slug: "atelier",
      name: designTitle(d),
      category: CATEGORY_OF[d.type],
      price,
      description: "Peça criada no Atelier Siomara.",
      images: svg ? [`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`] : [],
      inStock: true,
    };
    addItem(product, 1, { ...designOptions(d), Design: shareUrl() });
  };

  const whatsapp = () => {
    const lines = Object.entries(designOptions(d)).map(([k, v]) => `• ${k}: ${v}`);
    return whatsappUrl(
      [
        "Olá Siomara! 💕 Criei esta peça no Atelier:",
        `*${designTitle(d)}*`,
        ...lines,
        `Preço: ${formatPrice(price)}`,
        "",
        `Ver o design: ${shareUrl()}`,
      ].join("\n"),
    );
  };

  const share = async () => {
    const url = shareUrl();
    try {
      if (navigator.share) await navigator.share({ title: designTitle(d), url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* partilha cancelada */
    }
  };

  const isBracelet = d.type === "pulseira" || d.type === "casal";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
      {/* ================= PRÉ-VISUALIZAÇÃO ================= */}
      <div className="min-w-0 lg:sticky lg:top-28">
        <div className="sticker-lg relative overflow-hidden rounded-[2rem] bg-white">
          <PiecePreview ref={svgRef} design={d} className="block h-auto w-full" />

          {/* preço em autocolante */}
          <motion.div
            key={price}
            initial={{ scale: 0.6, rotate: -20 }}
            animate={{ scale: 1, rotate: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}
            className="sticker absolute right-4 top-4 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-butter text-center text-ink"
          >
            <span className="font-hand text-lg leading-none">só</span>
            <span className="font-display text-xl font-black leading-tight">{formatPrice(price)}</span>
          </motion.div>

          <span className="sticker absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-black uppercase tracking-wider text-ink">
            Ao vivo
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={surprise} className={buttonClasses("gold", "md")}>
            <Dices className="h-4 w-4" />
            Surpreenda-me
          </button>
          <button type="button" onClick={share} className={buttonClasses("outline", "md")}>
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Link copiado!" : "Partilhar design"}
          </button>
        </div>
      </div>

      {/* ================= PASSOS ================= */}
      <div className="flex min-w-0 flex-col gap-5 pb-32 lg:pb-0">
        <Step n={1} title="O que vamos criar?">
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 border-ink p-3 text-left transition-all",
                  d.type === t.id
                    ? "bg-gold shadow-[3px_3px_0_var(--color-shadow)]"
                    : "bg-white hover:-translate-y-0.5 hover:bg-sand",
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-white">
                  {TYPE_ICON[t.id]}
                </span>
                <span>
                  <span className="block text-sm font-black leading-tight">{t.label}</span>
                  <span className="block text-xs font-semibold text-ink/60">
                    desde {formatPrice(prices.base[t.id])}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Step>

        <Step n={2} title={d.type === "casal" ? "Os vossos nomes" : "O nome ou palavra"}>
          <div className="flex flex-col gap-3">
            <NameInput
              label={d.type === "casal" ? "Nome dela / dele" : "Nome"}
              value={d.name}
              max={type.maxLetters}
              onChange={(name) => set({ name })}
            />
            {d.type === "casal" && (
              <>
                <NameInput
                  label="E o outro nome"
                  value={d.name2}
                  max={type.maxLetters}
                  onChange={(name2) => set({ name2 })}
                />
                <Toggle checked={d.heart} onChange={(heart) => set({ heart })}>
                  Juntar com ♥ (fica <b>{d.name || "A"}♥{d.name2 || "B"}</b> e <b>{d.name2 || "B"}♥{d.name || "A"}</b>)
                </Toggle>
              </>
            )}
            {d.type === "chaves" && (
              <NameInput
                label="Pendente lateral (opcional)"
                value={d.name2}
                max={6}
                placeholder="EX.: ARMY"
                onChange={(name2) => set({ name2 })}
              />
            )}
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
              <span className="mr-1">Letras:</span>
              {LETTER_STYLES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => set({ letterStyle: l.id })}
                  aria-pressed={d.letterStyle === l.id}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border-2 border-ink px-2 py-1 transition-all",
                    d.letterStyle === l.id ? "bg-ink text-cream" : "bg-white hover:bg-sand",
                  )}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/20 text-[11px] font-black"
                    style={{ background: l.bg, color: l.fg }}
                  >
                    A
                  </span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </Step>

        {isBracelet && (
          <Step n={3} title="O fio">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit rounded-full border-2 border-ink bg-white p-1">
                {(["cetim", "macrame"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => set({ material: m })}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-black transition-colors",
                      d.material === m ? "bg-ink text-cream" : "text-ink hover:bg-sand",
                    )}
                  >
                    {m === "cetim" ? "Cetim fino" : "Macramé entrançado"}
                    {prices.material[m] ? ` +${formatPrice(prices.material[m])}` : ""}
                  </button>
                ))}
              </div>
              <Swatches
                options={CORDS.map((c) => ({ id: c.id, label: c.label, hex: c.hex }))}
                value={d.cord}
                onChange={(cord) => set({ cord })}
              />
            </div>
          </Step>
        )}

        <Step n={isBracelet ? 4 : 3} title="O estilo da sua Arte">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PRESETS.map((pr) => (
              <button
                key={pr.id}
                type="button"
                onClick={() => set({ preset: pr.id, custom: null })}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border-2 border-ink p-3 text-left transition-all",
                  d.preset === pr.id && !d.custom
                    ? "bg-sand shadow-[3px_3px_0_var(--color-shadow)]"
                    : "bg-white hover:-translate-y-0.5",
                )}
              >
                <PresetSample id={pr.id} accent={d.accent} />
                <span className="text-sm font-black leading-tight">{pr.label}</span>
                <span className="text-[11px] font-semibold leading-snug text-ink/60">
                  {pr.hint}
                  {prices.preset[pr.id] ? ` · +${formatPrice(prices.preset[pr.id])}` : ""}
                </span>
              </button>
            ))}
          </div>
          {(d.preset === "estrelas" || d.custom) && (
            <div className="mt-4">
              <span className="mb-2 block text-sm font-bold">Cor das estrelas</span>
              <Swatches
                options={ACCENTS.map((a) => ({ id: a.hex, label: a.label, hex: a.hex }))}
                value={d.accent}
                onChange={(accent) => set({ accent })}
              />
            </div>
          )}
        </Step>

        <Step n={isBracelet ? 5 : 4} title="Um pingente especial?">
          <div className="flex flex-wrap gap-2">
            {CHARMS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  d.custom
                    ? c.id !== "nenhum" && addBead({ kind: "charm", charm: c.id as CharmId })
                    : set({ charm: c.id as CharmId })
                }
                className={cn(
                  "rounded-full border-2 border-ink px-4 py-2 text-sm font-black transition-all",
                  d.charm === c.id ? "bg-gold shadow-[3px_3px_0_var(--color-shadow)]" : "bg-white hover:bg-sand",
                )}
              >
                {c.label}
                {prices.charm[c.id] ? (
                  <span className="ml-1 font-semibold text-ink/60">+{formatPrice(prices.charm[c.id])}</span>
                ) : null}
              </button>
            ))}
          </div>
        </Step>

        {d.type !== "casal" && (
          <Step
            n={isBracelet ? 6 : 5}
            title="Modo livre"
            badge="para quem quer tudo à sua maneira"
          >
            {!d.custom ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm font-semibold text-ink/70">
                  Monte a sua Arte peça a peça: acrescente, apague e arraste para mudar a ordem.
                </p>
                <button type="button" onClick={startFree} className={buttonClasses("outline", "md")}>
                  <Wand2 className="h-4 w-4" />
                  Começar a partir deste design
                </button>
              </div>
            ) : (
              <FreeEditor
                beads={d.custom}
                accent={d.accent}
                capacity={capacity}
                canUndo={history.length > 0}
                onChange={editCustom}
                onAdd={addBead}
                onUndo={undo}
                onExit={() => set({ custom: null })}
              />
            )}
          </Step>
        )}

        {/* resumo + ações (fixo em baixo no telemóvel) */}
        <div className="sticker-lg fixed inset-x-3 bottom-3 z-30 rounded-[1.6rem] bg-white p-4 lg:static lg:inset-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{designTitle(d)}</p>
              <p className="font-display text-2xl font-black text-gold-deep">{formatPrice(price)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <a
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Encomendar pelo WhatsApp"
                className={buttonClasses("outline", "md", "px-4")}
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <button type="button" onClick={addToCart} className={buttonClasses("primary", "md")}>
                <ShoppingBag className="h-4 w-4" />
                <span>Quero!</span>
              </button>
            </div>
          </div>
          <p className="mt-2 hidden text-xs font-semibold text-ink/50 lg:block">
            Feito à mão depois da encomenda · a Siomara confirma tudo consigo pelo WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= peças da interface ================= */

function Step({
  n,
  title,
  badge,
  children,
}: {
  n: number;
  title: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.6rem] border-2 border-ink bg-white/90 p-5"
    >
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <span className="sticker flex h-9 w-9 items-center justify-center rounded-full bg-butter font-display text-lg font-black">
          {n}
        </span>
        <h2 className="text-2xl">{title}</h2>
        {badge && <span className="font-hand text-xl text-gold-deep">{badge}</span>}
      </header>
      {children}
    </motion.section>
  );
}

function NameInput({
  label,
  value,
  max,
  placeholder = "ESCREVA AQUI",
  onChange,
}: {
  label: string;
  value: string;
  max: number;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-bold">
        {label}
        <span className="text-xs text-ink/50">
          {value.length}/{max}
        </span>
      </span>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(toBeadText(e.target.value, max))}
          placeholder={placeholder}
          maxLength={max}
          autoComplete="off"
          className="h-12 w-full rounded-full border-2 border-ink bg-sand px-5 font-black uppercase tracking-[0.18em] text-ink placeholder:text-ink/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold/40"
        />
        <button
          type="button"
          onClick={() => onChange(toBeadText(value + "♥", max))}
          aria-label="Acrescentar coração"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-gold text-lg transition-transform hover:rotate-12 hover:scale-110"
        >
          ♥
        </button>
      </div>
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-left text-sm font-semibold"
    >
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full border-2 border-ink transition-colors",
          checked ? "bg-gold" : "bg-white",
        )}
      >
        <motion.span
          layout
          className="absolute top-0.5 h-5 w-5 rounded-full border-2 border-ink bg-white"
          style={{ left: checked ? 22 : 2 }}
        />
      </span>
      <span>{children}</span>
    </button>
  );
}

function Swatches({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; hex: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-label={o.label}
          aria-pressed={value === o.id}
          title={o.label}
          className={cn(
            "h-10 w-10 rounded-full border-2 border-ink transition-transform hover:scale-110",
            value === o.id && "scale-110 shadow-[3px_3px_0_var(--color-shadow)] ring-4 ring-gold/50",
          )}
          style={{ background: o.hex }}
        />
      ))}
    </div>
  );
}

function PresetSample({ id, accent }: { id: string; accent: string }) {
  const row: Record<string, ReactNode> = {
    estrelas: (
      <>
        <StarBead size={20} color={accent} />
        <Pearl size={12} color="#e9eef5" />
        <LetterBead char="A" size={20} />
        <Pearl size={12} color="#e9eef5" />
        <StarBead size={20} color={accent} />
      </>
    ),
    perolas: (
      <>
        <Pearl size={16} />
        <Pearl size={7} color={JET} />
        <LetterBead char="A" size={20} />
        <Pearl size={7} color={JET} />
        <Pearl size={16} />
      </>
    ),
    cristal: (
      <>
        <Pearl size={14} color="#e9eef5" />
        <Pearl size={7} color={GOLD} />
        <LetterBead char="A" size={20} />
        <Pearl size={7} color={GOLD} />
        <Pearl size={14} color="#e9eef5" />
      </>
    ),
    smile: (
      <>
        <Pearl size={16} color="#222" />
        <LetterBead char="☺" size={20} />
        <Pearl size={7} color={MILK} />
        <Pearl size={16} color="#222" />
      </>
    ),
    minimal: (
      <>
        <span className="h-0.5 w-5 bg-ink" />
        <LetterBead char="A" size={20} />
        <span className="h-0.5 w-5 bg-ink" />
      </>
    ),
  };
  return <span className="flex h-6 items-center gap-0.5">{row[id]}</span>;
}

function BeadChip({ b, accent }: { b: Bead; accent: string }) {
  switch (b.kind) {
    case "letter":
      return <LetterBead char={b.char!} size={30} />;
    case "heart":
      return <LetterBead char="♥" size={30} />;
    case "smile":
      return <LetterBead char="☺" size={30} />;
    case "star":
      return <StarBead size={30} color={b.color ?? accent} />;
    case "pearl":
      return <Pearl size={22} />;
    case "black":
      return <Pearl size={22} color="#222" />;
    case "crystal":
      return <Pearl size={19} color="#e9eef5" />;
    case "seed":
      return <Pearl size={11} color={b.color ?? GOLD} />;
    case "eye":
      return (
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#1f4fd1]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
            <span className="h-2 w-2 rounded-full bg-black" />
          </span>
        </span>
      );
    case "charm":
      return (
        <span className="rounded-full border-2 border-ink bg-[#e9e9ec] px-2 py-1 text-[10px] font-black">
          {CHARMS.find((c) => c.id === b.charm)?.label}
        </span>
      );
  }
}

function FreeEditor({
  beads,
  accent,
  capacity,
  canUndo,
  onChange,
  onAdd,
  onUndo,
  onExit,
}: {
  beads: Bead[];
  accent: string;
  capacity: number;
  canUndo: boolean;
  onChange: (b: Bead[]) => void;
  onAdd: (b: Bead) => void;
  onUndo: () => void;
  onExit: () => void;
}) {
  const [letters, setLetters] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const palette: { label: string; bead: Bead }[] = [
    { label: "Estrela", bead: { kind: "star", color: accent } },
    { label: "Pérola", bead: { kind: "pearl" } },
    { label: "Cristal", bead: { kind: "crystal" } },
    { label: "Preta", bead: { kind: "black" } },
    { label: "Dourada", bead: { kind: "seed", color: GOLD } },
    { label: "Mini preta", bead: { kind: "seed", color: JET } },
    { label: "Mini branca", bead: { kind: "seed", color: MILK } },
    { label: "Coração", bead: { kind: "heart" } },
    { label: "Smile", bead: { kind: "smile" } },
    { label: "Olho grego", bead: { kind: "eye" } },
  ];
  const over = capacity > 100;

  return (
    <div className="flex flex-col gap-4">
      {/* paleta */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {palette.map((p) => (
          <motion.button
            key={p.label}
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={() => onAdd(p.bead)}
            className="flex flex-col items-center gap-1 rounded-xl border-2 border-ink/15 bg-cream p-2 text-[10px] font-bold transition-colors hover:border-ink hover:bg-sand"
          >
            <span className="flex h-8 items-center">
              <BeadChip b={p.bead} accent={accent} />
            </span>
            {p.label}
          </motion.button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          [...toBeadText(letters, 12)].forEach((ch) =>
            onAdd(ch === "♥" ? { kind: "heart" } : { kind: "letter", char: ch }),
          );
          setLetters("");
        }}
        className="flex gap-2"
      >
        <input
          value={letters}
          onChange={(e) => setLetters(toBeadText(e.target.value, 12))}
          placeholder="LETRAS A JUNTAR"
          className="h-11 w-full rounded-full border-2 border-ink bg-sand px-4 text-sm font-black uppercase tracking-[0.15em] placeholder:text-ink/30 focus:bg-white focus:outline-none"
        />
        <button type="submit" className={buttonClasses("primary", "sm", "h-11 px-5")}>
          Juntar
        </button>
      </form>

      {/* fio editável */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span>Arraste para mudar a ordem · toque numa peça para a tirar</span>
          <span className={over ? "text-gold-deep" : "text-ink/60"}>{capacity}% do fio</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full border-2 border-ink bg-white">
          <motion.div
            className={cn("h-full", over ? "bg-gold-deep" : "bg-gold")}
            animate={{ width: `${Math.min(capacity, 100)}%` }}
          />
        </div>
        {over && (
          <p className="mt-1 text-xs font-bold text-gold-deep">
            Não cabe tudo — as últimas peças ficam de fora.
          </p>
        )}
        <Reorder.Group
          axis="x"
          values={beads}
          onReorder={onChange}
          className="mt-3 flex min-h-14 items-center gap-1 overflow-x-auto rounded-2xl border-2 border-dashed border-ink/30 bg-cream px-3 py-3"
        >
          <AnimatePresence initial={false}>
            {beads.map((b, i) => (
              <Reorder.Item
                key={b.id}
                value={b}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onTap={() => setSelected((s) => (s === b.id ? null : b.id!))}
                className="group relative shrink-0 cursor-grab touch-none active:cursor-grabbing"
              >
                <BeadChip b={b} accent={accent} />
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    onChange(beads.filter((_, j) => j !== i));
                    setSelected(null);
                  }}
                  aria-label="Tirar peça"
                  className={cn(
                    "absolute -right-2 -top-2 z-10 h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-ink text-cream",
                    selected === b.id ? "flex" : "hidden lg:group-hover:flex",
                  )}
                >
                  <X className="h-3 w-3" />
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!canUndo} onClick={onUndo} className={buttonClasses("outline", "sm")}>
          <Undo2 className="h-3.5 w-3.5" /> Desfazer
        </button>
        <button type="button" onClick={() => onChange([])} className={buttonClasses("outline", "sm")}>
          <Trash2 className="h-3.5 w-3.5" /> Limpar
        </button>
        <button type="button" onClick={onExit} className={buttonClasses("ghost", "sm")}>
          Voltar ao automático
        </button>
      </div>

      <div className="pointer-events-none flex justify-end gap-2 opacity-80" aria-hidden>
        <HeartDoodle size={22} />
        <SparkleDoodle size={22} />
      </div>
    </div>
  );
}
