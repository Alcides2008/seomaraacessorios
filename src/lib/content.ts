import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

export type HeroSlide = {
  eyebrow: string;
  title: string; // use \n para quebrar linha
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  /** Foto do produto em destaque (opcional). */
  image?: string;
};

export type PromoContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export type SiteContent = {
  announcement: string;
  hero: HeroSlide[];
  promo: PromoContent;
};

export const defaultContent: SiteContent = {
  announcement: "Feito à mão com amor · Encomendas pelo WhatsApp · Entregas em Luanda",
  hero: [
    {
      eyebrow: "feito à mão, com amor",
      title: "Transformando amor\nem pulseiras",
      subtitle:
        "Pulseiras, pares de casal, fios de telemóvel e porta-chaves feitos à mão, só para si.",
      ctaLabel: "Ver a loja",
      ctaHref: "/loja",
    },
    {
      eyebrow: "Fios de telemóvel",
      title: "O seu nome,\nsempre à mão",
      subtitle:
        "Pérolas, estrelas e carinhas sorridentes — personalizados com o nome que quiser.",
      ctaLabel: "Ver fios de telemóvel",
      ctaHref: "/loja/fios-telemovel",
      image: "/products/s20261021-76.jpg",
    },
    {
      eyebrow: "Proteção & fé",
      title: "Pequenos nós,\ngrandes desejos",
      subtitle:
        "Pulseira vermelha de 7 nós, olho grego e terços personalizados com nomes.",
      ctaLabel: "Ver proteção",
      ctaHref: "/loja/protecao",
      image: "/products/s20261022-21.jpg",
    },
  ],
  promo: {
    eyebrow: "Presente perfeito",
    title: "Uma peça com o nome de quem ama",
    subtitle:
      "Diga-nos o nome, as letras e as cores — a Siomara monta tudo à mão, só para si.",
    ctaLabel: "Personalizar agora",
    ctaHref: "/loja",
  },
};

export async function getSiteContent(): Promise<SiteContent> {
  if (!isFirebaseConfigured) return defaultContent;
  try {
    const snap = await getDoc(doc(db, "content", "site"));
    if (snap.exists()) {
      const data = snap.data() as Partial<SiteContent>;
      return {
        announcement: data.announcement ?? defaultContent.announcement,
        hero: data.hero?.length ? data.hero : defaultContent.hero,
        promo: { ...defaultContent.promo, ...(data.promo ?? {}) },
      };
    }
    return defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await setDoc(doc(db, "content", "site"), content);
}
