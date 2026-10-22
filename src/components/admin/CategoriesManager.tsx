"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Category } from "@/types";
import { buttonClasses } from "@/components/ui/Button";
import {
  getCategories,
  saveCategory,
  deleteCategoryDb,
  seedCategories,
  isCategoriesSeeded,
} from "@/lib/categories-db";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const inputCls =
  "mt-1.5 w-full rounded-2xl border-2 border-ink bg-white px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40";

const gradientOf = (c1: string, c2: string) =>
  `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;

const hexesOf = (gradient?: string): [string, string] => {
  const m = (gradient ?? "").match(/#[0-9a-fA-F]{6}/g) ?? [];
  return [m[0] ?? "#fbe3ea", m[1] ?? "#f2b8c9"];
};

export function CategoriesManager() {
  const [cats, setCats] = useState<Category[]>([]);
  const [seeded, setSeeded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const [list, s] = await Promise.all([
      getCategories(),
      isCategoriesSeeded(),
    ]);
    setCats(list);
    setSeeded(s);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const doImport = async () => {
    setBusy(true);
    try {
      await seedCategories();
      await load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: Category) => {
    if (
      !confirm(
        `Apagar a categoria “${c.name}”? Os produtos nesta categoria deixam de aparecer até os mudar.`,
      )
    )
      return;
    await deleteCategoryDb(c.slug);
    await load();
  };

  if (editing) {
    return (
      <CategoryForm
        category={editing}
        existing={cats.map((c) => c.slug)}
        onCancel={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null);
          await load();
        }}
      />
    );
  }

  const newCategory = (): Category => ({
    slug: "",
    name: "",
    description: "",
    gradient: gradientOf("#fbe3ea", "#f2b8c9"),
    order: (cats.at(-1)?.order ?? cats.length) + 1,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl text-ink">Categorias</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "A carregar…" : `${cats.length} categorias`}
          </p>
        </div>
        <button
          onClick={() => setEditing(newCategory())}
          className={buttonClasses("primary", "md")}
        >
          <Plus className="h-4 w-4" /> Adicionar categoria
        </button>
      </div>

      {!seeded && !loading && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border-2 border-ink bg-butter p-5">
          <p className="text-sm text-ink">
            As categorias ainda estão no código. Importe-as para a base de dados
            para poder editá-las.
          </p>
          <button
            onClick={doImport}
            disabled={busy}
            className={buttonClasses("gold", "md")}
          >
            {busy ? "A importar…" : "Importar categorias"}
          </button>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-[1.4rem] border-2 border-ink bg-white">
        {cats.map((c) => (
          <div
            key={c.slug}
            className="flex items-center gap-4 border-b border-line p-3 last:border-b-0"
          >
            <div
              className="h-12 w-12 shrink-0 rounded-xl border-2 border-ink bg-cover bg-center"
              style={{ backgroundImage: c.gradient }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{c.name}</p>
              <p className="text-xs font-bold text-ink/60">
                /{c.slug}
              </p>
            </div>
            <button
              onClick={() => setEditing({ ...c })}
              aria-label="Editar"
              className="flex h-9 w-9 items-center justify-center rounded-[1.4rem] border-2 border-ink bg-white text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(c)}
              aria-label="Apagar"
              className="flex h-9 w-9 items-center justify-center rounded-[1.4rem] border-2 border-ink bg-white text-muted transition-colors hover:border-red-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryForm({
  category,
  existing,
  onCancel,
  onSaved,
}: {
  category: Category;
  existing: string[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const isNew = !category.slug;
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description ?? "");
  const [order, setOrder] = useState(category.order ?? 1);
  const [c1, c2Init] = hexesOf(category.gradient);
  const [colorA, setColorA] = useState(c1);
  const [colorB, setColorB] = useState(c2Init);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const finalSlug = (isNew ? slugify(name) : slug).trim();
    if (!name.trim() || !finalSlug) {
      alert("Indique o nome da categoria.");
      return;
    }
    if (isNew && existing.includes(finalSlug)) {
      alert("Já existe uma categoria com esse nome/endereço.");
      return;
    }
    setSaving(true);
    try {
      await saveCategory({
        slug: finalSlug,
        name: name.trim(),
        description: description.trim(),
        gradient: gradientOf(colorA, colorB),
        order: Number(order) || 1,
      });
      onSaved();
    } catch (e) {
      alert("Falha ao guardar.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">
          {isNew ? "Nova categoria" : "Editar categoria"}
        </h1>
        <button
          onClick={onCancel}
          aria-label="Fechar"
          className="text-muted hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <label className="block">
          <span className="text-sm font-bold text-ink/60">
            Nome
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-ink/60">
              Endereço (slug){!isNew && " · fixo"}
            </span>
            <input
              value={isNew ? slugify(name) : slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={!isNew}
              className={`${inputCls} ${!isNew ? "opacity-60" : ""}`}
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink/60">
              Ordem
            </span>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className={inputCls}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-ink/60">
            Descrição
          </span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
          />
        </label>

        <div>
          <span className="text-sm font-bold text-ink/60">
            Cor do cartão
          </span>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="color"
              value={colorA}
              onChange={(e) => setColorA(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-[1.4rem] border-2 border-ink bg-white"
            />
            <input
              type="color"
              value={colorB}
              onChange={(e) => setColorB(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-[1.4rem] border-2 border-ink bg-white"
            />
            <div
              className="h-10 flex-1 rounded-sm"
              style={{ backgroundImage: gradientOf(colorA, colorB) }}
            />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className={buttonClasses("primary", "lg", "min-w-32")}
          >
            {saving ? "A guardar…" : "Guardar"}
          </button>
          <button
            onClick={onCancel}
            className="text-sm font-bold text-ink/60 hover:text-ink"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
