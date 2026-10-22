/* ============================================================
   DJEYONE — Tipos de domínio
   ============================================================ */

/** As categorias agora são editáveis no painel, por isso o slug é livre. */
export type CategorySlug = string;

export interface Category {
  slug: CategorySlug;
  name: string;
  description?: string;
  /** Gradiente CSS do cartão da categoria. */
  gradient?: string;
  /** Ordem de apresentação. */
  order?: number;
  image?: string;
}

export interface ProductVariant {
  id: string;
  /** Ex.: "Tamanho", "Cor" */
  label: string;
  /** Ex.: "M", "Vermelho" */
  value: string;
  /** Para variações de cor */
  hex?: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  brand?: string;
  /** Preço em Kwanza (Kz) */
  price: number;
  /** Preço antigo, se em promoção */
  compareAtPrice?: number;
  description: string;
  images: string[];
  variants?: ProductVariant[];
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  featured?: boolean;
  /** Marcado como novidade */
  isNew?: boolean;
  /** Marcado como mais vendido */
  bestseller?: boolean;
  /** false = peça sem nome (ex.: yin-yang); por omissão segue a categoria */
  personalizavel?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
}
