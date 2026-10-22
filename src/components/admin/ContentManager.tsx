"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import {
  getSiteContent,
  saveSiteContent,
  defaultContent,
  type SiteContent,
  type HeroSlide,
} from "@/lib/content";
import { buttonClasses } from "@/components/ui/Button";

const inputCls =
  "mt-1.5 w-full rounded-2xl border-2 border-ink bg-white px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink/60">
        {label}
      </span>
      {children}
    </label>
  );
}

export function ContentManager() {
  const [c, setC] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getSiteContent()
      .then(setC)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setSlide = (i: number, patch: Partial<HeroSlide>) =>
    setC((prev) => ({
      ...prev,
      hero: prev.hero.map((s, j) => (j === i ? { ...s, ...patch } : s)),
    }));

  const save = async () => {
    setSaving(true);
    setDone(false);
    try {
      await saveSiteContent(c);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (e) {
      alert("Falha ao guardar.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted">A carregar…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-5xl text-ink">Conteúdo do site</h1>
      <p className="mt-1 text-sm text-muted">
        Edite os textos principais da página inicial.
      </p>

      {/* Barra de anúncio */}
      <section className="mt-8">
        <h2 className="font-display text-2xl text-ink">Barra de anúncio (topo)</h2>
        <input
          value={c.announcement}
          onChange={(e) => setC({ ...c, announcement: e.target.value })}
          className={inputCls}
        />
      </section>

      {/* Hero (página inicial) */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Topo da página inicial</h2>
        <div className="mt-3 flex flex-col gap-3 rounded-[1.4rem] border-2 border-ink bg-white p-4">
          <Field label="Sobretítulo (etiqueta amarela)">
            <input
              value={c.hero[0].eyebrow}
              onChange={(e) => setSlide(0, { eyebrow: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Título em caligrafia (Enter = nova linha; a última linha fica rosa)">
            <textarea
              value={c.hero[0].title}
              onChange={(e) => setSlide(0, { title: e.target.value })}
              rows={2}
              className={inputCls}
            />
          </Field>
          <Field label="Subtítulo">
            <textarea
              value={c.hero[0].subtitle}
              onChange={(e) => setSlide(0, { subtitle: e.target.value })}
              rows={2}
              className={inputCls}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Texto do 2.º botão">
              <input
                value={c.hero[0].ctaLabel}
                onChange={(e) => setSlide(0, { ctaLabel: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Link do 2.º botão">
              <input
                value={c.hero[0].ctaHref}
                onChange={(e) => setSlide(0, { ctaHref: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Bloco "presente perfeito" (polaroids)</h2>
        <div className="mt-3 flex flex-col gap-3 rounded-[1.4rem] border-2 border-ink bg-white p-4">
          <Field label="Sobretítulo">
            <input
              value={c.promo.eyebrow}
              onChange={(e) =>
                setC({ ...c, promo: { ...c.promo, eyebrow: e.target.value } })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Título">
            <input
              value={c.promo.title}
              onChange={(e) =>
                setC({ ...c, promo: { ...c.promo, title: e.target.value } })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Subtítulo">
            <textarea
              value={c.promo.subtitle}
              onChange={(e) =>
                setC({ ...c, promo: { ...c.promo, subtitle: e.target.value } })
              }
              rows={2}
              className={inputCls}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Texto do botão">
              <input
                value={c.promo.ctaLabel}
                onChange={(e) =>
                  setC({
                    ...c,
                    promo: { ...c.promo, ctaLabel: e.target.value },
                  })
                }
                className={inputCls}
              />
            </Field>
            <Field label="Link do botão">
              <input
                value={c.promo.ctaHref}
                onChange={(e) =>
                  setC({ ...c, promo: { ...c.promo, ctaHref: e.target.value } })
                }
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className={buttonClasses("primary", "lg", "min-w-32")}
        >
          {saving ? "A guardar…" : "Guardar alterações"}
        </button>
        {done && (
          <span className="flex items-center gap-1.5 text-sm text-gold-deep">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
      </div>
    </div>
  );
}
