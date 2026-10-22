import type { Metadata } from "next";
import { Atelier } from "@/components/atelier/Atelier";
import { Container } from "@/components/layout/Container";
import { BeadWord } from "@/components/ui/Beads";
import { BowDoodle, SparkleDoodle, Squiggle } from "@/components/ui/Doodles";

export const metadata: Metadata = {
  title: "Atelier — crie a sua peça",
  description:
    "Crie a sua pulseira, par de casal, fio de telemóvel ou porta-chaves: escolha o nome, o fio, o estilo e o pingente, e veja a sua Arte ao vivo.",
};

export default async function CriarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams(
    Object.entries(sp).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])),
  ).toString();

  return (
    <main className="relative flex-1 overflow-hidden pb-16 pt-8 md:pt-12">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,var(--color-champagne),transparent)]" />
      <div className="pointer-events-none absolute -right-24 top-64 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,var(--color-lilac),transparent)]" />

      <Container className="relative">
        <header className="mb-10 flex flex-col items-start gap-4 md:mb-14">
          <div className="flex items-center gap-3">
            <BeadWord word="ATELIER" size={30} gap={2} />
            <SparkleDoodle size={30} className="rotate-12" />
          </div>
          <h1 className="max-w-3xl text-5xl text-ink md:text-7xl">
            Crie a sua peça,{" "}
            <span className="relative inline-block italic text-gold" style={{ WebkitTextStroke: "2px var(--color-ink)" }}>
              com Arte ✦
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full text-ink" />
            </span>
          </h1>
          <p className="max-w-xl text-lg font-semibold text-muted">
            Escolha a peça, escreva o nome e brinque com fios, estrelas, pérolas e pingentes. O que
            vê é o que a Siomara monta à mão para si.
          </p>
          <BowDoodle size={70} className="absolute right-4 top-0 hidden rotate-12 md:block" />
        </header>

        <Atelier initialQuery={query} />
      </Container>
    </main>
  );
}
