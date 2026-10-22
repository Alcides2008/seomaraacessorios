import type { Product } from "@/types";
import type { PieceType } from "@/lib/atelier";
import { gradientForSlug } from "@/lib/category-style";

export type OptionValue = { value: string; hex?: string };
export type OptionGroup = {
  label: string;
  type: "color" | "size";
  values: OptionValue[];
};

const colorGroup = (values: OptionValue[]): OptionGroup => ({
  label: "Cor",
  type: "color",
  values,
});

const cordColors = colorGroup([
  { value: "Preto", hex: "#1c1c1c" },
  { value: "Vermelho", hex: "#c8242f" },
  { value: "Rosa", hex: "#e0789c" },
  { value: "Branco", hex: "#f4f1ee" },
]);

/** Opções (cor do fio) de um produto — provisórias, por categoria. */
export function productOptions(product: Product): OptionGroup[] {
  switch (product.category) {
    case "casal":
    case "pulseiras":
      return [cordColors];
    default:
      return [];
  }
}

/** Campo de personalização (o texto que vai em letras na peça). */
export type NameField = {
  key: string;
  label: string;
  max: number;
  optional?: boolean;
  /** terços: permite frases ("BENCAO PROTECAO") */
  spaces?: boolean;
};

/** Que nomes/letras cada peça leva — por categoria, desligável por produto. */
export function nameFields(product: Product): NameField[] {
  if (product.personalizavel === false) return [];
  switch (product.category) {
    case "casal":
      return [
        { key: "Nome 1", label: "1.º nome ou inicial", max: 8 },
        { key: "Nome 2", label: "2.º nome ou inicial", max: 8 },
      ];
    case "pulseiras":
      return [{ key: "Nome", label: "Nome na pulseira", max: 10 }];
    case "fios-telemovel":
      return [{ key: "Nome", label: "Nome ou palavra", max: 12 }];
    case "porta-chaves":
      return [
        { key: "Nome", label: "Nome", max: 12 },
        { key: "Pendente", label: "Texto do pendente (opcional)", max: 6, optional: true },
      ];
    case "tercos":
      return [{ key: "Palavras", label: "Nomes ou palavras", max: 24, spaces: true }];
    default:
      return [];
  }
}

/** Categoria da loja → tipo de peça no Atelier (para "abrir no Atelier"). */
export const ATELIER_TYPE: Record<string, PieceType> = {
  casal: "casal",
  pulseiras: "pulseira",
  "fios-telemovel": "fio",
  "porta-chaves": "chaves",
};

/**
 * Galeria do produto: fotos reais (como `url(...)`) quando existem;
 * caso contrário, variações do gradiente da categoria.
 */
export function productGallery(product: Product): string[] {
  if (product.images && product.images.length > 0)
    return product.images.map((src) => `url("${src}")`);
  const base = gradientForSlug(product.category);
  return ["135deg", "105deg", "160deg", "90deg"].map((a) =>
    base.replace("135deg", a),
  );
}

/** Imagem de capa (background-image) — foto real ou gradiente da categoria. */
export function productCover(product: Product): string {
  return product.images && product.images.length > 0
    ? `url("${product.images[0]}")`
    : gradientForSlug(product.category);
}

/** Todas as cores existentes no conjunto (para o filtro do catálogo). */
export function allColors(products: Product[]): OptionValue[] {
  const map = new Map<string, string | undefined>();
  for (const p of products) {
    for (const g of productOptions(p)) {
      if (g.type === "color") {
        for (const v of g.values) if (!map.has(v.value)) map.set(v.value, v.hex);
      }
    }
  }
  return [...map].map(([value, hex]) => ({ value, hex }));
}

export function productHasColor(p: Product, color: string): boolean {
  return productOptions(p).some(
    (g) => g.type === "color" && g.values.some((v) => v.value === color),
  );
}
