"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import {
  getSiteContent,
  saveSiteContent,
  defaultContent,
  type SiteContent,
} from "@/lib/content";
import { buttonClasses } from "@/components/ui/Button";

const inputCls =
  "mt-1.5 w-full rounded-2xl border border-edge bg-white px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40";

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
        Edite a faixa de anúncio que aparece no topo de todas as páginas.
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
