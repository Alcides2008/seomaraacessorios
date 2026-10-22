import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HandHeart, Sparkles, Gift, MessageCircleHeart } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Siomara Acessórios — loja online de artesanato. Pulseiras, fios de telemóvel, porta-chaves e terços personalizados, feitos à mão.",
};

const valores = [
  {
    icon: HandHeart,
    title: "Feito à mão",
    text: "Cada nó, cada detalhe e cada letra são colocados um a um.",
  },
  {
    icon: Sparkles,
    title: "Único como você",
    text: "Nomes, iniciais, datas e cores à sua escolha — nunca duas peças iguais.",
  },
  {
    icon: Gift,
    title: "Presente com significado",
    text: "Para casais, amigos, família e fé: peças que contam uma história.",
  },
  {
    icon: MessageCircleHeart,
    title: "Atendimento próximo",
    text: "Falamos consigo pelo WhatsApp do pedido à entrega.",
  },
];

// shortcut: história escrita a partir da bio do Instagram; trocar pelo texto real da Siomara.
export default function SobrePage() {
  return (
    <main className="flex-1">
      {/* Abertura */}
      <section className="bg-sand/50 py-20 md:py-28">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="tracking-luxe text-xs uppercase text-gold-deep">
                A nossa história
              </span>
              <h1 className="mt-5 font-display text-5xl text-ink md:text-6xl">
                Transformando amor{" "}
                <span className="italic text-gold-deep">em pulseiras</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
                A Siomara Acessórios é uma loja online de artesanato. Criamos
                peças personalizadas à mão — pequenas, delicadas e cheias de
                significado.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Fundadora + logo */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full">
                <Image
                  src="/logo-siomara.jpg"
                  alt="Logótipo da Siomara Acessórios — laço rosa"
                  fill
                  sizes="(min-width: 768px) 28rem, 90vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="tracking-luxe text-xs uppercase text-gold-deep">
                Quem está por trás
              </span>
              <h2 className="mt-4 font-display text-4xl text-ink">
                Siomara Martinho
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
                <p>
                  Tudo começa com um fio, um pouco de Arte e uma ideia: dar
                  forma a sentimentos. Um nome, as iniciais de um casal, um
                  pedido de proteção.
                </p>
                <p>
                  Hoje a Siomara faz pulseiras de casal, pulseiras com nome,
                  fios de telemóvel, porta-chaves e terços — sempre à medida de
                  quem encomenda.
                </p>
              </div>
              <Link
                href="https://www.instagram.com/siomaramartinho"
                className="mt-6 inline-block text-sm text-gold-deep underline-offset-4 hover:underline"
              >
                @siomaramartinho
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Valores */}
      <section className="border-y border-line bg-cream py-20">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="text-center">
                  <Icon className="mx-auto h-7 w-7 text-gold" strokeWidth={1.4} />
                  <h3 className="mt-4 text-lg text-ink">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl text-ink">
                Qual vai ser a sua peça?
              </h2>
              <p className="mt-4 text-muted">{siteConfig.description}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/loja" className={buttonClasses("primary", "lg")}>
                  Ver a loja
                </Link>
                <Link href="/contacto" className={buttonClasses("outline", "lg")}>
                  Encomenda especial
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
