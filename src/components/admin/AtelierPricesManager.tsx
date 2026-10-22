"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, RotateCcw } from "lucide-react";
import {
  CHARMS,
  DEFAULT_DESIGN,
  DEFAULT_PRICES,
  PRESETS,
  TYPES,
  designPrice,
  type AtelierPrices,
} from "@/lib/atelier";
import { getAtelierPrices, saveAtelierPrices } from "@/lib/atelier-prices";
import { formatPrice } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";

function PriceInput({
  label,
  value,
  onChange,
  suffix = "Kz",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink/70">{label}</span>
      <div className="mt-1 flex items-center rounded-2xl border-2 border-ink bg-white focus-within:ring-4 focus-within:ring-gold/40">
        <input
          type="number"
          min={0}
          step={suffix === "Kz" ? 50 : 1}
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full bg-transparent px-4 py-2.5 text-sm font-black focus:outline-none"
        />
        <span className="pr-4 text-xs font-bold text-ink/50">{suffix}</span>
      </div>
    </label>
  );
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.4rem] border-2 border-ink bg-white p-5">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {hint && <p className="mt-1 text-xs font-semibold text-ink/60">{hint}</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

/** Painel → Atelier: preços de cada peça, estilo, pingente, fio e letras. */
export function AtelierPricesManager() {
  const [p, setP] = useState<AtelierPrices>(DEFAULT_PRICES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getAtelierPrices()
      .then(setP)
      .finally(() => setLoading(false));
  }, []);

  const setIn = <K extends "base" | "preset" | "charm" | "material">(group: K, key: string, v: number) =>
    setP((prev) => ({ ...prev, [group]: { ...prev[group], [key]: v } }));

  const save = async () => {
    setSaving(true);
    setDone(false);
    try {
      await saveAtelierPrices(p);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (e) {
      console.error(e);
      alert("Falha ao guardar. Confirme que entrou com a conta de administradora (Google).");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted">A carregar…</p>;

  // exemplos ao vivo, para ver o efeito dos preços antes de guardar
  const examples = [
    { label: "Pulseira “SIOMARA” com estrelas", d: { ...DEFAULT_DESIGN } },
    {
      label: "Par de casal macramé + infinito",
      d: { ...DEFAULT_DESIGN, type: "casal" as const, name: "ALY", name2: "REGI", material: "macrame" as const, charm: "infinito" as const },
    },
    { label: "Fio de telemóvel com pérolas", d: { ...DEFAULT_DESIGN, type: "fio" as const, name: "CELMA", preset: "perolas" as const } },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-5xl text-ink">Atelier ✦ preços</h1>
      <p className="mt-1 text-sm font-semibold text-muted">
        O que cada peça e cada material custam na página “Crie a sua peça”. O preço final é a soma.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <Group title="Peças" hint="Preço de partida de cada tipo de peça.">
          {TYPES.map((t) => (
            <PriceInput key={t.id} label={t.label} value={p.base[t.id]} onChange={(v) => setIn("base", t.id, v)} />
          ))}
        </Group>

        <Group title="Estilos das contas" hint="Quanto se soma por cada estilo (0 = incluído).">
          {PRESETS.map((s) => (
            <PriceInput key={s.id} label={s.label} value={p.preset[s.id]} onChange={(v) => setIn("preset", s.id, v)} />
          ))}
        </Group>

        <Group title="Pingentes" hint="No par de casal conta 2× (um em cada pulseira).">
          {CHARMS.filter((c) => c.id !== "nenhum").map((c) => (
            <PriceInput key={c.id} label={c.label} value={p.charm[c.id]} onChange={(v) => setIn("charm", c.id, v)} />
          ))}
        </Group>

        <Group title="Fio das pulseiras" hint="Extra por tipo de fio. No par de casal conta 2×.">
          <PriceInput label="Cetim fino" value={p.material.cetim} onChange={(v) => setIn("material", "cetim", v)} />
          <PriceInput label="Macramé entrançado" value={p.material.macrame} onChange={(v) => setIn("material", "macrame", v)} />
        </Group>

        <Group title="Letras e modo livre">
          <PriceInput
            label="Letras incluídas"
            suffix="letras"
            value={p.freeLetters}
            onChange={(v) => setP({ ...p, freeLetters: Math.floor(v) })}
          />
          <PriceInput label="Cada letra a mais" value={p.extraLetter} onChange={(v) => setP({ ...p, extraLetter: v })} />
          <PriceInput label="Montar no modo livre" value={p.freeMode} onChange={(v) => setP({ ...p, freeMode: v })} />
        </Group>

        <section className="rounded-[1.4rem] border-2 border-ink bg-butter p-5">
          <h2 className="font-display text-2xl">Assim fica</h2>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm font-bold">
            {examples.map((e) => (
              <li key={e.label} className="flex justify-between gap-3">
                <span>{e.label}</span>
                <span className="font-black">{formatPrice(designPrice(e.d, p))}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button onClick={save} disabled={saving} className={buttonClasses("primary", "lg", "min-w-32")}>
          {saving ? "A guardar…" : "Guardar preços"}
        </button>
        <button onClick={() => setP(DEFAULT_PRICES)} className={buttonClasses("ghost", "md")}>
          <RotateCcw className="h-4 w-4" /> Repor valores de origem
        </button>
        {done && (
          <span className="flex items-center gap-1.5 text-sm font-bold text-gold-deep">
            <Check className="h-4 w-4" /> Guardado — o Atelier já usa estes preços
          </span>
        )}
      </div>
    </div>
  );
}
