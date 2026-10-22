/* ============================================================
   ATELIER SIOMARA — motor do criador de peças
   Geometria (pulseira na almofada, fio/porta-chaves pendurado),
   gerador de padrões de missangas, preço e link partilhável.
   ============================================================ */

export type PieceType = "pulseira" | "casal" | "fio" | "chaves";
export type PresetId = "estrelas" | "perolas" | "cristal" | "smile" | "minimal";
export type CharmId = "nenhum" | "coracao" | "infinito" | "ancora" | "yinyang" | "olho" | "cruz";
export type LetterStyle = "branca" | "preta" | "rosa";
export type Material = "cetim" | "macrame";
export type BeadKind =
  | "letter"
  | "heart"
  | "star"
  | "pearl"
  | "crystal"
  | "seed"
  | "black"
  | "smile"
  | "eye"
  | "charm";

export type Bead = {
  kind: BeadKind;
  char?: string;
  color?: string;
  charm?: CharmId;
  /** id estável (modo livre: arrastar para reordenar) */
  id?: string;
};

export type Design = {
  type: PieceType;
  name: string;
  /** casal: 2.º nome · porta-chaves: texto do pendente */
  name2: string;
  /** casal: juntar os nomes com ♥ (P♥M / M♥P) */
  heart: boolean;
  letterStyle: LetterStyle;
  material: Material;
  cord: string;
  preset: PresetId;
  accent: string;
  charm: CharmId;
  /** modo livre: sequência montada à mão (null = automático) */
  custom: Bead[] | null;
};

/* ---------------- Catálogo de opções ---------------- */

export const TYPES: {
  id: PieceType;
  label: string;
  hint: string;
  maxLetters: number;
}[] = [
  { id: "pulseira", label: "Pulseira", hint: "Com o seu nome", maxLetters: 10 },
  { id: "casal", label: "Par de casal", hint: "Duas pulseiras", maxLetters: 8 },
  { id: "fio", label: "Fio de telemóvel", hint: "Para pendurar", maxLetters: 12 },
  { id: "chaves", label: "Porta-chaves", hint: "Com mosquetão", maxLetters: 12 },
];

export const CORDS = [
  { id: "preto", label: "Preto", hex: "#231a1f" },
  { id: "vermelho", label: "Vermelho", hex: "#d1262f" },
  { id: "rosa", label: "Rosa", hex: "#ef6fa0" },
  { id: "branco", label: "Branco", hex: "#f1ece9" },
  { id: "azul", label: "Azul", hex: "#2f5fd0" },
  { id: "lilas", label: "Lilás", hex: "#9a63d6" },
];

export const ACCENTS = [
  { id: "rosa", label: "Rosa", hex: "#ff4f9a" },
  { id: "lilas", label: "Lilás", hex: "#9b5cc9" },
  { id: "azul", label: "Azul céu", hex: "#2ea3d6" },
  { id: "royal", label: "Azul royal", hex: "#2f45c9" },
  { id: "vermelho", label: "Vermelho", hex: "#d6303a" },
];

export const PRESETS: { id: PresetId; label: string; hint: string }[] = [
  { id: "estrelas", label: "Estrelas", hint: "Estrelas, cristais e dourado" },
  { id: "perolas", label: "Pérolas", hint: "Pérolas e detalhes pretos" },
  { id: "cristal", label: "Cristal", hint: "Cristais facetados e dourado" },
  { id: "smile", label: "Smile", hint: "Preto brilhante e carinhas" },
  { id: "minimal", label: "Só o nome", hint: "Fio à vista, discreto" },
];

export const CHARMS: { id: CharmId; label: string }[] = [
  { id: "nenhum", label: "Nenhum" },
  { id: "coracao", label: "Coração" },
  { id: "olho", label: "Olho grego" },
  { id: "cruz", label: "Cruz" },
  { id: "infinito", label: "Infinito" },
  { id: "ancora", label: "Âncora" },
  { id: "yinyang", label: "Yin-Yang" },
];

/* ---------------- Preços (editáveis no painel ADM → Atelier) ---------------- */

export type AtelierPrices = {
  /** preço de partida de cada peça */
  base: Record<PieceType, number>;
  /** extra de cada estilo de contas */
  preset: Record<PresetId, number>;
  /** extra de cada pingente (no par de casal conta 2×) */
  charm: Record<CharmId, number>;
  /** extra do tipo de fio, só pulseiras (no par de casal conta 2×) */
  material: Record<Material, number>;
  /** letras incluídas no preço */
  freeLetters: number;
  /** preço de cada letra a mais */
  extraLetter: number;
  /** extra por montar no modo livre */
  freeMode: number;
};

// valores de origem enquanto a Siomara não gravar os seus no painel
export const DEFAULT_PRICES: AtelierPrices = {
  base: { pulseira: 2000, casal: 3500, fio: 2500, chaves: 3000 },
  preset: { estrelas: 0, perolas: 300, cristal: 300, smile: 0, minimal: 0 },
  charm: { nenhum: 0, coracao: 300, olho: 300, cruz: 300, infinito: 800, ancora: 800, yinyang: 800 },
  material: { cetim: 0, macrame: 0 },
  freeLetters: 8,
  extraLetter: 100,
  freeMode: 300,
};

const priceOk = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;

/** Junta preços guardados (dados de fora) aos de origem: só aceita números ≥ 0, campo a campo. */
export function mergePrices(raw: unknown): AtelierPrices {
  const r = (raw ?? {}) as Record<string, unknown>;
  const group = <K extends string>(key: keyof AtelierPrices, def: Record<K, number>) => {
    const g = (r[key] ?? {}) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(def).map(([k, v]) => [k, priceOk(g[k]) ? g[k] : v]),
    ) as Record<K, number>;
  };
  const d = DEFAULT_PRICES;
  return {
    base: group("base", d.base),
    preset: group("preset", d.preset),
    charm: group("charm", d.charm),
    material: group("material", d.material),
    freeLetters: priceOk(r.freeLetters) ? Math.floor(r.freeLetters) : d.freeLetters,
    extraLetter: priceOk(r.extraLetter) ? r.extraLetter : d.extraLetter,
    freeMode: priceOk(r.freeMode) ? r.freeMode : d.freeMode,
  };
}

export const LETTER_STYLES: { id: LetterStyle; label: string; bg: string; fg: string }[] = [
  { id: "branca", label: "Branca", bg: "#ffffff", fg: "#1c1418" },
  { id: "preta", label: "Preta", bg: "#1c1418", fg: "#ffffff" },
  { id: "rosa", label: "Rosa", bg: "#ffc2da", fg: "#1c1418" },
];

export const GOLD = "#e3a62a";
export const JET = "#1c1418";
export const MILK = "#f4f1ee";

export const DEFAULT_DESIGN: Design = {
  type: "pulseira",
  name: "SIOMARA",
  name2: "",
  heart: true,
  letterStyle: "branca",
  material: "cetim",
  cord: "preto",
  preset: "estrelas",
  accent: "#ff4f9a",
  charm: "nenhum",
  custom: null,
};

export const cordHex = (id: string) => CORDS.find((c) => c.id === id)?.hex ?? CORDS[0].hex;
export const typeInfo = (t: PieceType) => TYPES.find((x) => x.id === t)!;

/** Só o que existe em missanga: A–Z, 0–9 e ♥ (sem acentos). */
export function toBeadText(raw: string, max = 12, spaces = false): string {
  const clean = raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(spaces ? /[^A-Z0-9♥ ]/g : /[^A-Z0-9♥]/g, "");
  return (spaces ? clean.replace(/ {2,}/g, " ").replace(/^ /, "") : clean).slice(0, max);
}

/* ---------------- Geometria ---------------- */

export const VIEW = 600;
type Pt = { x: number; y: number };
export type Shape = { pts: Pt[]; cum: number[]; length: number };

function sample(fn: (u: number) => Pt, n = 480): Shape {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) pts.push(fn(i / n));
  const cum = [0];
  for (let i = 1; i <= n; i++)
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, cum, length: cum[n] };
}

/** Ponto e ângulo (graus) à distância d ao longo da forma. */
export function pointAt(s: Shape, d: number): Pt & { angle: number } {
  const t = Math.min(Math.max(d, 0), s.length);
  let lo = 0;
  let hi = s.cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (s.cum[mid] < t) lo = mid;
    else hi = mid;
  }
  const a = s.pts[lo];
  const b = s.pts[hi];
  const seg = s.cum[hi] - s.cum[lo] || 1;
  const k = (t - s.cum[lo]) / seg;
  // arredondado: o SSR e o browser têm de gerar o mesmo transform (hidratação)
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return {
    x: r2(a.x + (b.x - a.x) * k),
    y: r2(a.y + (b.y - a.y) * k),
    angle: r2((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI),
  };
}

/** Faixa de pulseira por cima da almofada (vista de frente, como nas fotos). */
export const CUSHION = { x: 112, y: 118, w: 376, h: 392 };
export function strandShape(y0: number): Shape {
  const x0 = CUSHION.x + 8;
  const x1 = CUSHION.x + CUSHION.w - 8;
  return sample((u) => ({ x: x0 + (x1 - x0) * u, y: y0 + 12 * Math.sin(Math.PI * u) }), 200);
}

/** Gota pendurada (fio de telemóvel / porta-chaves): bico em cima, no nó. */
export const LOOP_TOP = 178;
export function loopShape(h: number, w: number): Shape {
  const cx = VIEW / 2;
  return sample((u) => {
    const t = 2 * Math.PI * u;
    const k = Math.pow((1 - Math.cos(t)) / 2, 0.55);
    return { x: cx + w * Math.sin(t) * k, y: LOOP_TOP + (h * (1 - Math.cos(t))) / 2 };
  });
}

/** Pendente do porta-chaves: cai do mosquetão pelo meio da volta. */
export const TAIL_START = 34;
export function tailShape(): Shape {
  return sample((u) => ({ x: VIEW / 2 + 8 * Math.sin(Math.PI * u), y: LOOP_TOP + 6 + 290 * u }), 120);
}

export function shapesFor(type: PieceType) {
  switch (type) {
    case "casal":
      return { strands: [strandShape(250), strandShape(400)] };
    case "fio":
      return { loop: loopShape(350, 200) };
    case "chaves":
      return { loop: loopShape(320, 185), tail: tailShape() };
    default:
      return { strands: [strandShape(320)] };
  }
}

/* ---------------- Tamanhos e disposição ---------------- */

const SIZE: Record<BeadKind, number> = {
  letter: 30,
  heart: 30,
  smile: 30,
  eye: 30,
  star: 32,
  pearl: 24,
  black: 24,
  crystal: 21,
  seed: 11,
  charm: 42,
};
const GAP = 2;
const KNOT = 14;

export const beadSize = (b: Bead) =>
  b.kind === "charm" ? (b.charm === "infinito" ? 60 : 42) : SIZE[b.kind];
const beadLen = (b: Bead) => beadSize(b) + GAP;
const seqLen = (l: Bead[]) => l.reduce((s, b) => s + beadLen(b), 0);

export type Placed = { bead: Bead; x: number; y: number; angle: number; scale?: number };

/** Faixa aberta: missangas centradas; se não couber, encolhem um pouco (nunca se corta o nome). */
export function layoutStrand(beads: Bead[], s: Shape): Placed[] {
  const total = seqLen(beads);
  const k = Math.min(1, s.length / (total || 1));
  let d = (s.length - total * k) / 2;
  return beads.map((bead) => {
    const len = beadLen(bead) * k;
    const p = pointAt(s, d + len / 2);
    d += len;
    return k < 1 ? { bead, ...p, scale: Math.round(k * 100) / 100 } : { bead, ...p };
  });
}

/** Volta fechada: missangas à volta toda, a partir do nó. */
export function layoutLoop(beads: Bead[], s: Shape, start = KNOT): Placed[] {
  const avail = s.length - 2 * start;
  const list = [...beads];
  while (list.length && seqLen(list) > avail) list.pop();
  const extra = list.length ? Math.min((avail - seqLen(list)) / list.length, 4) : 0;
  let d = start;
  return list.map((bead) => {
    const len = beadLen(bead) + extra;
    const p = pointAt(s, d + len / 2);
    d += len;
    return { bead, ...p };
  });
}

/* ---------------- Gerador de padrões ---------------- */

const lettersOf = (text: string): Bead[] =>
  [...text].map((ch) => (ch === "♥" ? { kind: "heart" } : { kind: "letter", char: ch }));

function unitFor(preset: PresetId, accent: string, loop: boolean): Bead[] {
  switch (preset) {
    case "estrelas":
      return [
        { kind: "seed", color: GOLD },
        { kind: "star", color: accent },
        { kind: "seed", color: GOLD },
        { kind: "crystal" },
      ];
    case "perolas":
      return [{ kind: "seed", color: JET }, { kind: "pearl" }];
    case "cristal":
      return [{ kind: "seed", color: GOLD }, { kind: "crystal" }];
    case "smile":
      return [{ kind: "seed", color: MILK }, { kind: "black" }];
    default:
      return loop ? [{ kind: "seed", color: JET }, { kind: "black" }] : [];
  }
}

/** Repete a unidade até ocupar `len`. */
function fill(len: number, unit: Bead[], from = 0): Bead[] {
  const out: Bead[] = [];
  if (!unit.length) return out;
  let used = 0;
  for (let i = from; ; i++) {
    const b = unit[i % unit.length];
    if (used + beadLen(b) > len) break;
    out.push(b);
    used += beadLen(b);
  }
  return out;
}

const charmBead = (c: CharmId): Bead[] =>
  c === "nenhum" ? [] : [{ kind: "charm", charm: c }];

function strandBeads(d: Design, text: string, s: Shape): Bead[] {
  const core: Bead[] = [...charmBead(d.charm), ...(d.charm !== "nenhum" ? [{ kind: "seed", color: GOLD } as Bead] : []), ...lettersOf(text)];
  if (d.preset === "minimal")
    return [{ kind: "seed", color: GOLD }, ...core, { kind: "seed", color: GOLD }];
  const unit = unitFor(d.preset, d.accent, false);
  const side = (s.length - seqLen(core)) / 2 - 1;
  const smiles: Bead[] =
    d.preset === "smile"
      ? [{ kind: "seed", color: MILK }, { kind: "smile" }, { kind: "smile" }, { kind: "smile" }]
      : [];
  const left = fill(side, unit);
  const right = [...smiles, ...fill(side - seqLen(smiles), unit, 0)];
  return [...left.reverse(), ...core, ...right];
}

function loopBeads(d: Design, s: Shape): Bead[] {
  const avail = s.length - 2 * KNOT;
  const unit = unitFor(d.preset, d.accent, true);
  const anchors: { at: number; beads: Bead[] }[] = [
    { at: 0.73, beads: lettersOf(d.name || "♥") },
  ];
  if (d.preset === "smile")
    anchors.push({ at: 0.27, beads: [{ kind: "smile" }, { kind: "seed", color: MILK }, { kind: "smile" }, { kind: "seed", color: MILK }, { kind: "smile" }] });
  if (d.type === "fio" && d.charm !== "nenhum")
    anchors.push({ at: 0.5, beads: charmBead(d.charm) });
  anchors.sort((a, b) => a.at - b.at);

  const out: Bead[] = [];
  let cursor = 0;
  let k = 0;
  for (const a of anchors) {
    const target = a.at * avail - seqLen(a.beads) / 2;
    const gap = fill(Math.max(0, target - cursor), unit, k);
    k += gap.length;
    out.push(...gap, ...a.beads);
    cursor += seqLen(gap) + seqLen(a.beads);
  }
  out.push(...fill(avail - cursor, unit, k));
  return out;
}

function tailBeads(d: Design, s: Shape): Bead[] {
  const end = d.charm !== "nenhum" ? charmBead(d.charm) : [{ kind: "heart" } as Bead];
  const text = lettersOf(d.name2);
  const unit = unitFor(d.preset === "minimal" ? "smile" : d.preset, d.accent, true);
  const room = s.length - 2 * TAIL_START;
  // o pingente da ponta nunca é cortado: o enchimento é que se ajusta
  const head: Bead[] = [{ kind: "seed", color: GOLD }];
  const body = fill(room - seqLen(head) - seqLen(text) - seqLen(end), unit);
  return [...head, ...text, ...body, ...end];
}

/** Sequências de missangas de cada parte da peça. */
export function buildPiece(d: Design): { strands?: Bead[][]; loop?: Bead[]; tail?: Bead[] } {
  const shapes = shapesFor(d.type);
  if (shapes.strands) {
    if (d.type === "casal") {
      const a = d.name || "A";
      const b = d.name2 || "B";
      const [t1, t2] = d.heart ? [`${a}♥${b}`, `${b}♥${a}`] : [a, b];
      return { strands: [strandBeads(d, t1, shapes.strands[0]), strandBeads(d, t2, shapes.strands[1])] };
    }
    return { strands: [d.custom ?? strandBeads(d, d.name || "♥", shapes.strands[0])] };
  }
  return {
    loop: d.custom ?? loopBeads(d, shapes.loop!),
    tail: shapes.tail ? tailBeads(d, shapes.tail) : undefined,
  };
}

/* ---------------- Preço e resumo ---------------- */

export function designPrice(d: Design, p: AtelierPrices = DEFAULT_PRICES): number {
  const pair = d.type === "casal" ? 2 : 1;
  const bracelet = d.type === "pulseira" || d.type === "casal";
  // no modo livre o estilo vem das contas escolhidas, não do estilo automático
  const preset = d.custom ? p.freeMode : p.preset[d.preset];
  const charm = p.charm[d.charm] * pair;
  const material = bracelet ? p.material[d.material] * pair : 0;
  const letters = (d.name + (d.type === "pulseira" || d.type === "fio" ? "" : d.name2)).replace(/♥/g, "").length;
  const extraLetters = Math.max(0, letters - p.freeLetters) * p.extraLetter;
  return p.base[d.type] + preset + charm + material + extraLetters;
}

export function designTitle(d: Design): string {
  const t = typeInfo(d.type).label;
  const names = d.type === "casal" ? `${d.name || "A"} & ${d.name2 || "B"}` : d.name || "♥";
  return `${t} personalizad${d.type === "fio" ? "o" : "a"} · ${names}`;
}

/** Opções legíveis (carrinho, encomenda por WhatsApp). */
export function designOptions(d: Design): Record<string, string> {
  const o: Record<string, string> = {
    Peça: typeInfo(d.type).label,
    Nome: d.name || "—",
  };
  if (d.type === "casal") o["2.º nome"] = d.name2 || "—";
  if (d.type === "chaves" && d.name2) o["Pendente"] = d.name2;
  if (d.type === "pulseira" || d.type === "casal")
    o.Fio = `${d.material === "macrame" ? "Macramé" : "Cetim"} ${CORDS.find((c) => c.id === d.cord)?.label.toLowerCase()}`;
  o.Letras = LETTER_STYLES.find((l) => l.id === d.letterStyle)!.label;
  o.Estilo = d.custom ? "Modo livre" : PRESETS.find((p) => p.id === d.preset)!.label;
  if (d.preset === "estrelas" || d.custom)
    o["Cor de destaque"] = ACCENTS.find((a) => a.hex === d.accent)?.label ?? d.accent;
  if (d.charm !== "nenhum") o.Pingente = CHARMS.find((c) => c.id === d.charm)!.label;
  if (d.custom) o.Sequência = encodeBeads(d.custom);
  return o;
}

/* ---------------- Link partilhável ---------------- */

export function encodeBeads(list: Bead[]): string {
  return list
    .map((b) => {
      switch (b.kind) {
        case "letter": return `L${b.char}`;
        case "star": return `S${(b.color ?? "#ff4f9a").slice(1)}`;
        case "seed": return `G${(b.color ?? GOLD).slice(1)}`;
        case "charm": return `X${b.charm}`;
        default: return { heart: "H", pearl: "P", crystal: "C", black: "B", smile: "M", eye: "E" }[b.kind];
      }
    })
    .join(".");
}

export function decodeBeads(s: string): Bead[] {
  return s
    .split(".")
    .filter(Boolean)
    .map((t): Bead | null => {
      const c = t[0];
      const rest = t.slice(1);
      if (c === "L" && /^[A-Z0-9]$/.test(rest)) return { kind: "letter", char: rest };
      if (c === "S" && /^[0-9a-f]{6}$/i.test(rest)) return { kind: "star", color: `#${rest}` };
      if (c === "G" && /^[0-9a-f]{6}$/i.test(rest)) return { kind: "seed", color: `#${rest}` };
      if (c === "X" && CHARMS.some((x) => x.id === rest)) return { kind: "charm", charm: rest as CharmId };
      const k = ({ H: "heart", P: "pearl", C: "crystal", B: "black", M: "smile", E: "eye" } as const)[c as "H"];
      return k && !rest ? { kind: k } : null;
    })
    .filter((b): b is Bead => b !== null)
    .slice(0, 80);
}

export function designToQuery(d: Design): string {
  const q = new URLSearchParams({
    t: d.type,
    n: d.name,
    ls: d.letterStyle,
    m: d.material,
    c: d.cord,
    p: d.preset,
    a: d.accent.slice(1),
    ch: d.charm,
  });
  if (d.name2) q.set("n2", d.name2);
  if (!d.heart) q.set("h", "0");
  if (d.custom) q.set("f", encodeBeads(d.custom));
  return q.toString();
}

/** Lê um design do URL, validando cada campo (o URL vem de fora). */
export function designFromQuery(q: URLSearchParams): Design {
  const pick = <T extends string>(v: string | null, ok: readonly T[], def: T): T =>
    v && (ok as readonly string[]).includes(v) ? (v as T) : def;
  const d = DEFAULT_DESIGN;
  const type = pick(q.get("t"), TYPES.map((t) => t.id), d.type);
  const max = typeInfo(type).maxLetters;
  const accent = `#${q.get("a") ?? ""}`;
  const f = q.get("f");
  return {
    type,
    name: q.has("n") ? toBeadText(q.get("n")!, max) : d.name,
    name2: toBeadText(q.get("n2") ?? "", type === "chaves" ? 6 : max),
    heart: q.get("h") !== "0",
    letterStyle: pick(q.get("ls"), LETTER_STYLES.map((l) => l.id), d.letterStyle),
    material: pick(q.get("m"), ["cetim", "macrame"] as const, d.material),
    cord: pick(q.get("c"), CORDS.map((c) => c.id), d.cord),
    preset: pick(q.get("p"), PRESETS.map((p) => p.id), d.preset),
    accent: ACCENTS.some((a) => a.hex === accent) ? accent : d.accent,
    charm: pick(q.get("ch"), CHARMS.map((c) => c.id), d.charm),
    custom: f && type !== "casal" ? decodeBeads(f) : null,
  };
}
