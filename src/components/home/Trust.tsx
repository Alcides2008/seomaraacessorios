"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BeadWord } from "@/components/ui/Beads";
import { HeartDoodle, SparkleDoodle, StarDoodle } from "@/components/ui/Doodles";
import { buttonClasses } from "@/components/ui/Button";

const WORDS = [
  "Feito à mão",
  "100% personalizado",
  "Pulseiras de casal",
  "Fios de telemóvel",
  "Porta-chaves",
  "Terços com nomes",
  "7 nós",
  "Olho grego",
];

const STEPS = [
  {
    n: "1",
    title: "Crie",
    text: "Escolha a peça no Atelier ou na loja e escreva o nome, as letras e as cores.",
    doodle: <SparkleDoodle size={44} />,
    bg: "bg-butter",
  },
  {
    n: "2",
    title: "Confirme",
    text: "A Siomara fala consigo pelo WhatsApp para acertar os detalhes e o pagamento.",
    doodle: <HeartDoodle size={44} />,
    bg: "bg-sand",
  },
  {
    n: "3",
    title: "Receba",
    text: "A peça é montada à mão, com todo o cuidado, e chega até si com carinho.",
    doodle: <StarDoodle size={44} />,
    bg: "bg-sky",
  },
];

function Band({ reverse, className }: { reverse?: boolean; className: string }) {
  const row = [...WORDS, ...WORDS];
  return (
    <div className={`overflow-hidden border-y-2 border-ink py-3 ${className}`}>
      <div className={`flex w-max items-center gap-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-2xl font-black md:text-3xl">
            {w}
            <span aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Faixas cruzadas + "como funciona". */
export function Trust() {
  return (
    <section className="relative overflow-x-clip py-16 md:py-24">
      <div className="relative -mx-4 h-40 md:h-48">
        <Band className="absolute inset-x-0 top-6 -rotate-3 bg-gold text-ink" />
        <Band reverse className="absolute inset-x-0 top-20 rotate-2 bg-ink text-cream md:top-24" />
      </div>

      <Container className="mt-14">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <BeadWord word="COMO FUNCIONA" size={26} gap={2} className="justify-center" />
            <h2 className="mt-5 text-4xl md:text-6xl">Três passos, zero stress</h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div
                className={`relative h-full rounded-[2rem] border-2 border-ink p-7 shadow-[6px_6px_0_var(--color-shadow)] ${s.bg} ${i % 2 ? "md:translate-y-6" : ""}`}
              >
                <span className="absolute -right-3 -top-4">{s.doodle}</span>
                <span className="font-script text-7xl leading-none text-gold-deep">
                  {s.n}
                </span>
                <h3 className="mt-3 text-3xl">{s.title}</h3>
                <p className="mt-2 font-semibold text-ink/75">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/criar" className={buttonClasses("primary", "lg")}>
            Começar a criar ✦
          </Link>
        </div>
      </Container>
    </section>
  );
}
