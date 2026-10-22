// Verificação rápida do motor do Atelier: node scripts/check-atelier.ts
import assert from "node:assert/strict";
import {
  DEFAULT_DESIGN, buildPiece, decodeBeads, designFromQuery, designPrice, designToQuery,
  encodeBeads, layoutLoop, layoutStrand, mergePrices, shapesFor, toBeadText, DEFAULT_PRICES, type Design,
} from "../src/lib/atelier.ts";

// texto → só missangas válidas, sem acentos
assert.equal(toBeadText("Conceição ♥ 2"), "CONCEICAO♥2");
// terços: frases com espaços (sem espaços duplos nem no início)
assert.equal(toBeadText("  Bênção   proteção", 24, true), "BENCAO PROTECAO");

// link partilhável: ida e volta preserva o design
for (const type of ["pulseira", "casal", "fio", "chaves"] as const) {
  const d: Design = { ...DEFAULT_DESIGN, type, name: "MARA", name2: type === "chaves" ? "ARMY" : "", charm: "infinito" };
  const back = designFromQuery(new URLSearchParams(designToQuery(d)));
  assert.deepEqual(back, d, type);
}

// sequência livre: codificar/decodificar
const seq = buildPiece({ ...DEFAULT_DESIGN, type: "fio" }).loop!;
assert.deepEqual(decodeBeads(encodeBeads(seq)), seq);

// URL malicioso/estranho não rebenta e cai nos valores por omissão
const bad = designFromQuery(new URLSearchParams("t=x&c=<script>&a=zzz&f=Lab.Q.X..S12"));
assert.equal(bad.type, "pulseira");
assert.equal(bad.cord, DEFAULT_DESIGN.cord);

// as missangas cabem sempre na forma e o nome aparece inteiro
for (const type of ["pulseira", "casal", "fio", "chaves"] as const) {
  const d = { ...DEFAULT_DESIGN, type, name: "ELISABETH" };
  const piece = buildPiece(d);
  const s = shapesFor(type);
  const placed = s.strands
    ? piece.strands!.flatMap((b, i) => layoutStrand(b, s.strands![i]))
    : layoutLoop(piece.loop!, s.loop!);
  const letters = placed.filter((p) => p.bead.kind === "letter").map((p) => p.bead.char).join("");
  assert.ok(letters.includes("ELISABETH"), `${type}: ${letters}`);
  assert.ok(placed.every((p) => p.x >= 0 && p.x <= 600 && p.y >= 0 && p.y <= 600), type);
}

// nome no máximo + pingente grande: encolhe mas não corta
{
  const d = { ...DEFAULT_DESIGN, name: "ELISABETHH", charm: "infinito" as const, preset: "cristal" as const };
  const placed = layoutStrand(buildPiece(d).strands![0], shapesFor("pulseira").strands![0]);
  assert.equal(placed.filter((p) => p.bead.kind === "letter").map((p) => p.bead.char).join(""), "ELISABETHH");
  assert.ok(placed.some((p) => p.bead.kind === "charm"));
}

assert.equal(designPrice(DEFAULT_DESIGN), 2000);

// preços do painel: casal com macramé e infinito conta 2×, letras a mais pagam
{
  const p = mergePrices({ base: { casal: 4000 }, material: { macrame: 250 }, charm: { infinito: 500 }, freeLetters: 6, extraLetter: 50 });
  const d: Design = { ...DEFAULT_DESIGN, type: "casal", material: "macrame", charm: "infinito", name: "ALICIA", name2: "REGINA" };
  // 4000 base + estrelas 0 + 2×500 + 2×250 + (12-6)×50
  assert.equal(designPrice(d, p), 4000 + 1000 + 500 + 300);
  // modo livre troca o extra do estilo pelo extra do modo livre
  assert.equal(designPrice({ ...DEFAULT_DESIGN, preset: "perolas", custom: [] }), 2000 + DEFAULT_PRICES.freeMode);
}

// valores estranhos vindos da base de dados são ignorados campo a campo
{
  const p = mergePrices({ base: { pulseira: -5, fio: "999" }, freeLetters: Number.NaN, extraLetter: 150, lixo: 1 });
  assert.equal(p.base.pulseira, DEFAULT_PRICES.base.pulseira);
  assert.equal(p.base.fio, DEFAULT_PRICES.base.fio);
  assert.equal(p.freeLetters, DEFAULT_PRICES.freeLetters);
  assert.equal(p.extraLetter, 150);
  assert.deepEqual(mergePrices(null), DEFAULT_PRICES);
}
console.log("atelier ok");
