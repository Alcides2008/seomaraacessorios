import type { Category } from "@/types";

/* ============================================================
   SIOMARA ACESSÓRIOS — Configuração global do site
   ============================================================ */

export const siteConfig = {
  name: "Siomara Acessórios",
  shortName: "Siomara",
  tagline: "Transformando amor em pulseiras",
  description:
    "Pulseiras, fios de telemóvel, porta-chaves e terços personalizados, feitos à mão em Angola.",
  currency: "Kz",
  locale: "pt-AO",
  contact: {
    email: "",
    phone: "+244 934 872 731",
    // número usado nos links wa.me (sem + nem espaços)
    whatsapp: "244934872731",
  },
  social: {
    instagram: "https://www.instagram.com/siomara_acessorios",
    instagramHandle: "@siomara_acessorios",
    facebook: "",
  },
  /** Dados de pagamento (modelo manual — Angola). PENDENTE: confirmar com a Siomara. */
  payment: {
    expressNumber: "934872731",
    reference: { entity: "", reference: "" },
  },
} as const;

export const categories: Category[] = [
  {
    slug: "casal",
    image: "/products/s20261022-45.jpg",
    name: "Casal",
    description: "Pulseiras a dois, com nomes e iniciais.",
    gradient: "linear-gradient(135deg, #fbe3ea 0%, #f2b8c9 100%)",
    order: 1,
  },
  {
    slug: "pulseiras",
    image: "/products/s20261022-22.jpg",
    name: "Pulseiras",
    description: "Com o seu nome, estrelas e cristais.",
    gradient: "linear-gradient(135deg, #fdeef2 0%, #f6c9d6 100%)",
    order: 2,
  },
  {
    slug: "fios-telemovel",
    image: "/products/s20261021-74.jpg",
    name: "Fios de Telemóvel",
    description: "O seu nome sempre à mão.",
    gradient: "linear-gradient(135deg, #f8e6ee 0%, #e9bfd0 100%)",
    order: 3,
  },
  {
    slug: "porta-chaves",
    image: "/products/s20261022-50.jpg",
    name: "Porta-chaves",
    description: "Para a mala, as chaves e a mochila.",
    gradient: "linear-gradient(135deg, #f4e4f1 0%, #dcbfe0 100%)",
    order: 4,
  },
  {
    slug: "protecao",
    image: "/products/s20261022-31.jpg",
    name: "Proteção",
    description: "7 nós, olho grego e peças de fé.",
    gradient: "linear-gradient(135deg, #fbe2e2 0%, #eeb0b4 100%)",
    order: 5,
  },
  {
    slug: "tercos",
    image: "/products/s20261022-21.jpg",
    name: "Terços",
    description: "Terços personalizados com nomes.",
    gradient: "linear-gradient(135deg, #f9efe9 0%, #ead2c6 100%)",
    order: 6,
  },
];

/** Links principais de navegação (cabeçalho) */
export const mainNav = [
  { label: "Início", href: "/" },
  { label: "Loja", href: "/loja" },
  ...categories.map((c) => ({
    label: c.name,
    href: `/loja/${c.slug}`,
  })),
  { label: "Sobre", href: "/sobre" },
  { label: "Contacto", href: "/contacto" },
];
