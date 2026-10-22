/**
 * Gradientes (CSS) por categoria — usados como fundo dos cartões e como
 * imagem de reserva quando um produto não tem foto.
 */
export const categoryGradient: Record<string, string> = {
  casal: "linear-gradient(135deg, #fbe3ea 0%, #f2b8c9 100%)",
  pulseiras: "linear-gradient(135deg, #fdeef2 0%, #f6c9d6 100%)",
  "fios-telemovel": "linear-gradient(135deg, #f8e6ee 0%, #e9bfd0 100%)",
  "porta-chaves": "linear-gradient(135deg, #f4e4f1 0%, #dcbfe0 100%)",
  protecao: "linear-gradient(135deg, #fbe2e2 0%, #eeb0b4 100%)",
  tercos: "linear-gradient(135deg, #f9efe9 0%, #ead2c6 100%)",
};

/** Gradiente rosa para categorias novas (sem gradiente definido). */
export const DEFAULT_GRADIENT =
  "linear-gradient(135deg, #fbe3ea 0%, #f2b8c9 100%)";

/** Gradiente de uma categoria por slug, com reserva. */
export const gradientForSlug = (slug: string): string =>
  categoryGradient[slug] ?? DEFAULT_GRADIENT;
