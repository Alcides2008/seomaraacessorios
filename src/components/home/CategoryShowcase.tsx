import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/categories-db";
import { DEFAULT_GRADIENT } from "@/lib/category-style";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

// cada categoria é um autocolante de cor diferente, ligeiramente torto
const TILES = [
  { bg: "bg-sand", rot: "" },
  { bg: "bg-butter", rot: "" },
  { bg: "bg-lilac", rot: "" },
  { bg: "bg-sky", rot: "" },
  { bg: "bg-mint", rot: "" },
  { bg: "bg-peach", rot: "" },
];

export async function CategoryShowcase() {
  const categories = await getCategories();
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="escolha o seu mundo"
            title="Coleções"
            description="Peças feitas à mão para cada momento — a dois, para si ou para oferecer."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-7">
          {categories.map((c, i) => {
            const t = TILES[i % TILES.length];
            return (
              <Reveal key={c.slug} delay={i * 0.06}>
                <Link
                  href={`/loja/${c.slug}`}
                  className={cn(
                    "group block rounded-[2rem] border-2 border-ink p-3 shadow-[5px_5px_0_var(--color-shadow)] transition-all duration-300 ease-premium hover:rotate-0 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-shadow)]",
                    t.bg,
                    t.rot,
                  )}
                >
                  <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border-2 border-ink bg-white">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-premium group-hover:scale-110"
                      style={{
                        backgroundImage: c.image ? `url("${c.image}")` : (c.gradient ?? DEFAULT_GRADIENT),
                      }}
                    />
                  </div>
                  <div className="flex items-end justify-between gap-2 px-1 pb-1 pt-3">
                    <div>
                      <h3 className="text-xl text-ink md:text-2xl">{c.name}</h3>
                      {c.description && (
                        <p className="mt-0.5 hidden text-xs font-bold text-ink/70 sm:block">{c.description}</p>
                      )}
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
