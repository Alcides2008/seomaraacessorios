"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";
import type { Product, CategorySlug } from "@/types";
import { useCategories } from "@/context/CategoriesContext";
import { cn, formatPrice } from "@/lib/utils";
import { productCover } from "@/lib/product-options";
import {
  getAllProducts,
  isSeeded,
  saveProduct,
  deleteProductDb,
  seedProductsToFirestore,
  newProductId,
} from "@/lib/products-db";
import { uploadProductImage } from "@/lib/storage";
import { buttonClasses } from "@/components/ui/Button";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyProduct = (): Product => ({
  id: newProductId(),
  slug: "",
  name: "",
  category: "pulseiras",
  price: 0,
  description: "",
  images: [],
  inStock: true,
});

export function ProductManager() {
  const categories = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [seeded, setSeeded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const [list, s] = await Promise.all([getAllProducts(), isSeeded()]);
    setProducts(list);
    setSeeded(s);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const doImport = async () => {
    setBusy(true);
    try {
      await seedProductsToFirestore();
      await load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: Product) => {
    if (!confirm(`Apagar “${p.name}”?`)) return;
    await deleteProductDb(p.id);
    await load();
  };

  if (editing) {
    return (
      <ProductForm
        product={editing}
        onCancel={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null);
          await load();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl text-ink">Produtos</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "A carregar…" : `${products.length} produtos`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={doImport}
            disabled={busy}
            className={buttonClasses("outline", "md")}
            title="Repõe produtos em falta sem apagar edições"
          >
            {busy ? "A repor…" : "Repor produtos"}
          </button>
          <button
            onClick={() => setEditing(emptyProduct())}
            className={buttonClasses("primary", "md")}
          >
            <Plus className="h-4 w-4" /> Adicionar produto
          </button>
        </div>
      </div>

      {!seeded && !loading && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border-2 border-ink bg-butter p-5">
          <p className="text-sm text-ink">
            Os produtos ainda estão no código. Importe-os para a base de dados
            para poder editá-los e guardar.
          </p>
          <button
            onClick={doImport}
            disabled={busy}
            className={buttonClasses("gold", "md")}
          >
            {busy ? "A importar…" : "Importar produtos"}
          </button>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-[1.4rem] border-2 border-ink bg-white">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border-b border-line p-3 last:border-b-0"
          >
            <div
              className="h-14 w-12 shrink-0 rounded-xl border-2 border-ink bg-cover bg-center"
              style={{ backgroundImage: productCover(p) }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{p.name}</p>
              <p className="text-xs font-bold text-ink/60">
                {categories.find((c) => c.slug === p.category)?.name}
                {!p.inStock && " · esgotado"}
              </p>
            </div>
            <span className="hidden text-sm text-ink sm:block">
              {formatPrice(p.price)}
            </span>
            <button
              onClick={() => setEditing({ ...p })}
              aria-label="Editar"
              className="flex h-9 w-9 items-center justify-center rounded-[1.4rem] border-2 border-ink bg-white text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(p)}
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

/* ------------------------- Formulário ------------------------- */

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

function ProductForm({
  product,
  onCancel,
  onSaved,
}: {
  product: Product;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const categories = useCategories();
  const [p, setP] = useState<Product>(product);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const isNewProduct = !product.slug;

  const set = (patch: Partial<Product>) => setP((prev) => ({ ...prev, ...patch }));

  const addUrl = () => {
    const u = urlInput.trim();
    if (u) set({ images: [...p.images, u] });
    setUrlInput("");
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      set({ images: [...p.images, url] });
    } catch (err) {
      alert(
        "Falha ao carregar a imagem. Confirme a configuração do Cloudinary (ou cole o link da imagem).",
      );
      console.error(err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async () => {
    if (!p.name.trim() || p.price <= 0) {
      alert("Indique pelo menos o nome e um preço válido.");
      return;
    }
    setSaving(true);
    try {
      await saveProduct({
        ...p,
        slug: p.slug.trim() || slugify(p.name),
        compareAtPrice: p.compareAtPrice || undefined,
      });
      onSaved();
    } catch (err) {
      alert("Falha ao guardar.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">
          {isNewProduct ? "Novo produto" : "Editar produto"}
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
        <Field label="Nome">
          <input
            value={p.name}
            onChange={(e) =>
              set(
                isNewProduct
                  ? { name: e.target.value, slug: slugify(e.target.value) }
                  : { name: e.target.value },
              )
            }
            className={inputCls}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Categoria">
            <select
              value={p.category}
              onChange={(e) =>
                set({ category: e.target.value as CategorySlug })
              }
              className={inputCls}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Link da página (slug)">
            <input
              value={p.slug}
              onChange={(e) => set({ slug: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Preço (Kz)">
            <input
              type="number"
              value={p.price || ""}
              onChange={(e) => set({ price: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="Preço antes (promoção, opcional)">
            <input
              type="number"
              value={p.compareAtPrice || ""}
              onChange={(e) =>
                set({ compareAtPrice: Number(e.target.value) || undefined })
              }
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Descrição">
          <textarea
            value={p.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={4}
            className={inputCls}
          />
        </Field>

        {/* Imagens */}
        <div>
          <span className="text-sm font-bold text-ink/60">
            Imagens
          </span>
          <div className="mt-2 flex flex-wrap gap-3">
            {p.images.map((img, i) => (
              <div key={i} className="relative h-20 w-16">
                <div
                  className="h-full w-full rounded-xl border-2 border-ink bg-cover bg-center"
                  style={{ backgroundImage: `url("${img}")` }}
                />
                <button
                  onClick={() =>
                    set({ images: p.images.filter((_, j) => j !== i) })
                  }
                  aria-label="Remover imagem"
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex h-20 w-16 flex-col items-center justify-center gap-1 rounded-[1.6rem] border-2 border-dashed border-ink/30 bg-white text-muted transition-colors hover:border-ink hover:text-ink"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              <span className="text-[9px] uppercase">Carregar</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              className="hidden"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="…ou cole o link de uma imagem"
              className="flex-1 rounded-[1.4rem] border-2 border-ink bg-white bg-cream px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
            <button
              onClick={addUrl}
              className={buttonClasses("outline", "sm")}
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Etiquetas + stock */}
        <div className="flex flex-wrap gap-4">
          {(
            [
              ["inStock", "Em stock"],
              ["featured", "Destaque"],
              ["isNew", "Novo"],
              ["bestseller", "Popular"],
            ] as [keyof Product, string][]
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 text-sm text-ink"
            >
              <input
                type="checkbox"
                checked={Boolean(p[key])}
                onChange={(e) => set({ [key]: e.target.checked } as Partial<Product>)}
                className="h-4 w-4 accent-gold"
              />
              {label}
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={p.personalizavel !== false}
              onChange={(e) => set({ personalizavel: e.target.checked ? undefined : false })}
              className="h-4 w-4 accent-gold"
            />
            Leva nome (personalizável)
          </label>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className={cn(buttonClasses("primary", "lg"), "min-w-32")}
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
