import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon } from "@/components/ui/SocialIcons";

const tiles = [
  "s20261021-74",
  "s20261021-59",
  "s20261022-22",
  "s20261021-69",
  "s20261022-45",
  "s20261022-21",
].map((f) => `url("/products/${f}.jpg")`);

export function InstagramFeed() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={siteConfig.social.instagramHandle}
            title="Siga-nos no Instagram"
            description="Novas peças, encomendas personalizadas e muito amor em cada nó."
            link={{ label: "Seguir", href: siteConfig.social.instagram }}
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
          {tiles.map((g, i) => (
            <Reveal key={i} delay={(i % 6) * 0.06}>
              <Link
                href={siteConfig.social.instagram}
                aria-label="Abrir Instagram"
                className="group relative block aspect-square overflow-hidden rounded-2xl border-2 border-ink shadow-[3px_3px_0_var(--color-shadow)] transition-transform hover:-rotate-2"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-premium group-hover:scale-110"
                  style={{ backgroundImage: g }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30">
                  <InstagramIcon className="h-6 w-6 text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
