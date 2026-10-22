import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/lib/categories-db";
import { Container } from "./Container";
import { BeadWord } from "@/components/ui/Beads";
import { BowDoodle, HeartDoodle } from "@/components/ui/Doodles";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { whatsappUrl } from "@/lib/whatsapp";

const empresaLinks = [
  { label: "Atelier ✦", href: "/criar" },
  { label: "Sobre a Siomara", href: "/sobre" },
  { label: "Contacto", href: "/contacto" },
  { label: "A minha conta", href: "/conta" },
  { label: "Favoritos", href: "/favoritos" },
];

const social =
  "flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[3px_3px_0_var(--color-shadow)] transition-transform hover:-translate-y-0.5 hover:rotate-6";

export async function Footer() {
  const categories = await getCategories();
  return (
    <footer className="relative mt-24 bg-gold text-ink">
      {/* borda ondulada */}
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute -top-[38px] left-0 h-10 w-full" aria-hidden>
        <path
          d="M0 40V20C60 4 120 4 180 20S300 36 360 20 480 4 540 20 660 36 720 20 840 4 900 20s120 16 180 0 120-16 180 0 120 16 180 0V40Z"
          fill="var(--color-gold)"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
        />
      </svg>

      <Container className="relative py-16">
        <BowDoodle size={84} className="absolute right-6 top-6 hidden rotate-12 md:block" />

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BeadWord word="SIOMARA" size={38} gap={3} />
            <p className="mt-5 max-w-sm text-lg font-bold">
              {siteConfig.tagline} ♡ {siteConfig.description}
            </p>
            <div className="mt-6 flex gap-3">
              <a href={whatsappUrl("Olá Siomara! 💕")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={social}>
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <Link href={siteConfig.social.instagram} aria-label="Instagram" className={social}>
                <InstagramIcon className="h-5 w-5" />
              </Link>
              {siteConfig.social.facebook && (
                <Link href={siteConfig.social.facebook} aria-label="Facebook" className={social}>
                  <FacebookIcon className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-hand text-3xl font-bold">Loja</h4>
            <ul className="mt-4 space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/loja/${c.slug}`} className="font-bold underline-offset-4 hover:underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-hand text-3xl font-bold">Siomara</h4>
            <ul className="mt-4 space-y-2">
              {empresaLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-bold underline-offset-4 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t-2 border-ink bg-ink text-cream">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-sm font-bold md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="flex items-center gap-2">
            Feito à mão em Angola <HeartDoodle size={18} />
          </p>
        </Container>
      </div>
    </footer>
  );
}
