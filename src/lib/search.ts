import type { Product } from "@/types";

/** Minúsculas + sem acentos, para pesquisa tolerante. */
export const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Filtra produtos por nome, descrição, marca ou categoria. */
export function searchProducts(products: Product[], query: string): Product[] {
  const q = normalize(query.trim());
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.description, p.brand ?? "", p.category].some((field) =>
      normalize(field).includes(q),
    ),
  );
}
