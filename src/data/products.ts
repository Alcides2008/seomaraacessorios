import type { Product } from "@/types";

const P = "/products";

/**
 * Catálogo real da Siomara Acessórios — fotos em public/products.
 * Preços PROVISÓRIOS (a confirmar pela Siomara).
 */
export const products: Product[] = [
  // ======================= CASAL =======================
  {
    id: "1",
    slug: "pulseiras-casal-iniciais-coracao",
    name: "Pulseiras de Casal · Iniciais & Coração",
    category: "casal",
    price: 3500,
    description:
      "Par de pulseiras em fio de cetim vermelho com as vossas iniciais e um coração ao centro. Ajustáveis, feitas à mão — um símbolo pequeno para um amor grande.",
    images: [`${P}/s20261021-59.jpg`, `${P}/s20261021-58.jpg`],
    inStock: true,
    featured: true,
    bestseller: true,
  },
  {
    id: "2",
    slug: "pulseiras-casal-nomes-coracao",
    name: "Pulseiras de Casal · Nomes & Coração",
    category: "casal",
    price: 4500,
    description:
      "Duas pulseiras em macramé preto com os dois nomes unidos por um coração vermelho. Entrançadas à mão, ajustáveis ao pulso.",
    images: [`${P}/s20261022-30.jpg`],
    inStock: true,
    bestseller: true,
  },
  {
    id: "3",
    slug: "pulseiras-casal-macrame-nomes",
    name: "Pulseiras de Casal · Macramé com Nome",
    category: "casal",
    price: 4000,
    description:
      "Par de pulseiras em macramé preto, cada uma com um nome. Clássicas, discretas e feitas para usar todos os dias.",
    images: [`${P}/s20261022-33.jpg`, `${P}/s20261022-38.jpg`],
    inStock: true,
  },
  {
    id: "4",
    slug: "pulseiras-casal-infinito",
    name: "Pulseiras de Casal · Infinito",
    category: "casal",
    price: 5000,
    description:
      "Pulseiras em macramé com pingente de infinito prateado e a inicial de quem se ama. Para um amor que não tem fim.",
    images: [`${P}/s20261022-45.jpg`],
    inStock: true,
    isNew: true,
    bestseller: true,
  },
  {
    id: "5",
    slug: "pulseiras-casal-yin-yang",
    personalizavel: false,
    name: "Pulseiras de Casal · Yin & Yang",
    category: "casal",
    price: 4500,
    description:
      "Duas metades que se completam: pulseiras entrançadas com pingente yin-yang preto e branco.",
    images: [`${P}/s20261022-24.jpg`],
    inStock: true,
  },
  {
    id: "6",
    slug: "pulseiras-casal-ancora",
    personalizavel: false,
    name: "Pulseiras de Casal · Âncora",
    category: "casal",
    price: 4500,
    description:
      "Par de pulseiras de contas (azul e preto) com pingente de âncora e strass. Ajustáveis — a âncora que vos mantém juntos.",
    images: [`${P}/s20261022-40.jpg`],
    inStock: true,
    isNew: true,
  },
  {
    id: "7",
    slug: "pulseiras-casal-deadpool",
    personalizavel: false,
    name: "Pulseiras de Casal · Deadpool",
    category: "casal",
    price: 4500,
    description:
      "Pulseiras em macramé com emblema Deadpool, em várias combinações de cor (preto/vermelho, rosa/branco). Para casais com humor.",
    images: [`${P}/s20261022-26.jpg`, `${P}/s20261022-36.jpg`],
    inStock: true,
  },
  {
    id: "8",
    slug: "pulseiras-casal-deadpool-iniciais",
    name: "Pulseiras de Casal · Deadpool com Iniciais",
    category: "casal",
    price: 5000,
    description:
      "Macramé vermelho com emblema Deadpool e a inicial de cada um. Personalize com as vossas letras.",
    images: [`${P}/s20261022-35.jpg`],
    inStock: true,
    isNew: true,
  },

  // ======================= PULSEIRAS =======================
  {
    id: "9",
    slug: "pulseira-nome-estrelas-rosa",
    name: "Pulseira com Nome · Estrelas Rosa",
    category: "pulseiras",
    price: 2500,
    description:
      "Pulseira ajustável com o seu nome, estrelas rosa-choque, cristais e contas douradas. Divertida, delicada e só sua.",
    images: [`${P}/s20261022-22.jpg`],
    inStock: true,
    featured: true,
    bestseller: true,
  },
  {
    id: "10",
    slug: "pulseira-nome-estrelas-lilas",
    name: "Pulseira com Nome · Estrelas Lilás",
    category: "pulseiras",
    price: 2500,
    description:
      "A mesma pulseira querida, agora em lilás: nome personalizado, estrelas, cristais e fecho ajustável.",
    images: [`${P}/s20261022-23.jpg`],
    inStock: true,
    isNew: true,
  },
  {
    id: "11",
    slug: "pulseira-nome-cristais",
    name: "Pulseira com Nome · Cristais",
    category: "pulseiras",
    price: 3000,
    description:
      "Elegante e luminosa: cristais facetados, contas douradas e o nome que quiser. Fecho de correr ajustável.",
    images: [`${P}/s20261022-37.jpg`],
    inStock: true,
  },

  // ======================= PROTEÇÃO =======================
  {
    id: "12",
    slug: "pulseira-vermelha-7-nos",
    name: "Pulseira Vermelha · Proteção 7 Nós",
    category: "protecao",
    price: 1500,
    description:
      "A tradicional pulseira vermelha de 7 nós — proteção, evolução espiritual, abundância, saúde, paz interior, amor-próprio e fluidez. Fio de cetim, ajustável.",
    images: [`${P}/s20261022-34.jpg`, `${P}/s20261022-28.jpg`],
    inStock: true,
    bestseller: true,
  },
  {
    id: "13",
    slug: "pulseira-olho-grego",
    name: "Pulseira Olho Grego",
    category: "protecao",
    price: 2500,
    description:
      "Contas pretas brilhantes com olho grego azul — o amuleto clássico contra más energias. Também disponível com cristais rosados.",
    images: [`${P}/s20261022-31.jpg`, `${P}/s20261022-32.jpg`],
    inStock: true,
    featured: true,
  },
  {
    id: "14",
    slug: "pulseiras-nos-crucifixo-buzio",
    name: "Pulseiras de Fé · Nós, Crucifixo & Búzio",
    category: "protecao",
    price: 2000,
    description:
      "Pulseiras de nós em cetim preto com crucifixo, pulseira de contas com búzio e colar de pérolas com cruz. Peças de fé, simples e bonitas.",
    images: [`${P}/s20261022-42.jpg`],
    inStock: true,
  },

  // ======================= FIOS DE TELEMÓVEL =======================
  {
    id: "15",
    slug: "fio-telemovel-perolas-estrelas-rosa",
    name: "Fio de Telemóvel · Pérolas & Estrelas Rosa",
    category: "fios-telemovel",
    price: 3000,
    description:
      "Pérolas, estrelas rosa e o seu nome. Um fio de telemóvel romântico que nunca passa despercebido.",
    images: [`${P}/s20261021-76.jpg`, `${P}/s20261022-25.jpg`],
    inStock: true,
    featured: true,
    bestseller: true,
  },
  {
    id: "16",
    slug: "fio-telemovel-estrelas-rosa",
    name: "Fio de Telemóvel · Estrelas Rosa & Preto",
    category: "fios-telemovel",
    price: 3000,
    description:
      "Estrelas rosa, pérolas, cristais e contas pretas, com o nome entre corações.",
    images: [`${P}/s20261021-74.jpg`, `${P}/s20261022-44.jpg`],
    inStock: true,
    isNew: true,
  },
  {
    id: "17",
    slug: "fio-telemovel-smile",
    name: "Fio de Telemóvel · Smile Preto & Branco",
    category: "fios-telemovel",
    price: 3000,
    description:
      "Preto e branco com carinhas sorridentes e o nome (ou data) que quiser. Minimalista e cheio de personalidade.",
    images: [`${P}/s20261021-73.jpg`, `${P}/s20261021-71.jpg`],
    inStock: true,
    bestseller: true,
  },
  {
    id: "18",
    slug: "fio-telemovel-azul-ceu",
    name: "Fio de Telemóvel · Azul Céu",
    category: "fios-telemovel",
    price: 3000,
    description:
      "Corações azul-céu, pedras leitosas, carinhas e o seu nome. Suave e fresco.",
    images: [`${P}/s20261021-69.jpg`],
    inStock: true,
  },
  {
    id: "19",
    slug: "fio-telemovel-estrelas-azuis",
    name: "Fio de Telemóvel · Estrelas Azuis",
    category: "fios-telemovel",
    price: 2500,
    description:
      "Estrelas azul-turquesa, cristais e contas pretas e brancas. Leve, alegre e fácil de combinar.",
    images: [`${P}/s20261021-70.jpg`, `${P}/s20261022-39.jpg`],
    inStock: true,
  },
  {
    id: "20",
    slug: "fio-telemovel-rock",
    name: "Fio de Telemóvel · Rock",
    category: "fios-telemovel",
    price: 3000,
    description:
      "Contas listradas, pretas e prateadas, com placa 'rock' e o seu nome. Para quem tem atitude.",
    images: [`${P}/s20261021-68.jpg`],
    inStock: true,
  },
  {
    id: "21",
    slug: "fio-telemovel-estrelas-royal",
    name: "Fio de Telemóvel · Estrelas Azul-Royal",
    category: "fios-telemovel",
    price: 3000,
    description:
      "Estrelas azul-royal, carinhas e cristais com o seu nome. Intenso e elegante.",
    images: [`${P}/s20261022-46.jpg`],
    inStock: true,
    isNew: true,
  },
  {
    id: "22",
    slug: "fios-telemovel-duo",
    name: "Fios de Telemóvel · Duo Personalizado",
    category: "fios-telemovel",
    price: 5500,
    description:
      "Dois fios a combinar, com nomes e datas especiais. Perfeito para casais, irmãos ou melhores amigos.",
    images: [`${P}/s20261022-49.jpg`],
    inStock: true,
  },

  // ======================= PORTA-CHAVES =======================
  {
    id: "23",
    slug: "porta-chaves-listras-nome",
    name: "Porta-chaves · Listras com Nome",
    category: "porta-chaves",
    price: 3500,
    description:
      "Mosquetão prateado, contas listradas, cristais e o seu nome, com pendente 'good'. Para a mala, chaves ou mochila.",
    images: [`${P}/s20261022-27.jpg`],
    inStock: true,
  },
  {
    id: "24",
    slug: "porta-chaves-army-vermelho",
    name: "Porta-chaves · ARMY Vermelho",
    category: "porta-chaves",
    price: 3500,
    description:
      "Para fãs de K-pop: estrelas vermelhas, iniciais dos membros e pendente ARMY. Personalize com as suas letras.",
    images: [`${P}/s20261022-29.jpg`],
    inStock: true,
    isNew: true,
  },
  {
    id: "25",
    slug: "porta-chaves-bts-army-lilas",
    name: "Porta-chaves · BTS ARMY Lilás",
    category: "porta-chaves",
    price: 3500,
    description:
      "Estrelas lilás, corações, placa 'kiss' e as palavras BTS e ARMY. O favorito de quem é ARMY de coração.",
    images: [`${P}/s20261022-41.jpg`],
    inStock: true,
    bestseller: true,
  },
  {
    id: "26",
    slug: "porta-chaves-smile",
    name: "Porta-chaves · Smile",
    category: "porta-chaves",
    price: 3500,
    description:
      "Preto, cristal e carinhas sorridentes, com o nome à sua escolha e pendente lateral.",
    images: [`${P}/s20261022-48.jpg`],
    inStock: true,
  },
  {
    id: "27",
    slug: "porta-chaves-lilas-nome",
    name: "Porta-chaves · Lilás Love",
    category: "porta-chaves",
    price: 4000,
    description:
      "Mosquetão dourado, estrelas lilás, coração LOVE e nome completo. Um mimo para oferecer.",
    images: [`${P}/s20261022-50.jpg`],
    inStock: true,
    isNew: true,
  },

  // ======================= TERÇOS =======================
  {
    id: "28",
    slug: "terco-personalizado-bencao",
    name: "Terço Personalizado · Bênção & Proteção",
    category: "tercos",
    price: 6000,
    description:
      "Terço de pérolas e cristais com as palavras que escolher (ex.: Bênção, Proteção, Família) e crucifixo prateado.",
    images: [`${P}/s20261022-21.jpg`],
    inStock: true,
    featured: true,
  },
  {
    id: "29",
    slug: "terco-personalizado-nomes",
    name: "Terço Personalizado · Nomes",
    category: "tercos",
    price: 6000,
    description:
      "Terço com nomes, contas coloridas (rosa ou bordô), medalha de santo e crucifixo de São Bento. Um presente com significado.",
    images: [`${P}/s20261022-51.jpg`],
    inStock: true,
    bestseller: true,
  },
  {
    id: "30",
    slug: "terco-perolas-estrelas-azuis",
    name: "Terço Pérolas & Estrelas Azuis",
    category: "tercos",
    price: 6500,
    description:
      "Pérolas, estrelas azuis e contas âmbar, medalha de São Bento e nomes personalizados.",
    images: [`${P}/s20261022-47.jpg`, `${P}/s20261022-43.jpg`],
    inStock: true,
    isNew: true,
  },
];
