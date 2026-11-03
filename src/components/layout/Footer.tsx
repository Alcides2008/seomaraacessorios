import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/lib/categories-db";
import { Container } from "./Container";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { whatsappUrl } from "@/lib/whatsapp";

const empresaLinks = [
  { label: "Atelier", href: "/criar" },
  { label: "Sobre a Siomara", href: "/sobre" },
  { label: "Contacto", href: "/contacto" },
  { label: "A minha conta", href: "/conta" },
  { label: "Favoritos", href: "/favoritos" },
];

const social =
  "flex h-11 w-11 items-center justify-center rounded-full border border-edge bg-white text-ink shadow-[0_12px_32px_-22px_rgba(59,34,48,0.35)] transition-transform hover:-translate-y-0.5";

export async function Footer() {
  const categories = await getCategories();
  return (
    <footer className="relative mt-24 bg-ink text-cream">

      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image src="/logo-siomara.png" alt={siteConfig.name} width={900} height={435} className="h-20 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/75">
              {siteConfig.tagline}. {siteConfig.description}
            </p>
            <div className="mt-6 flex gap-3">
              <a href={whatsappUrl("Olá Siomara!")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={social}>
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
            <h4 className="font-hand text-champagne">Loja</h4>
            <ul className="mt-4 space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/loja/${c.slug}`} className="text-sm text-cream/75 transition-colors hover:text-cream">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-hand text-champagne">Siomara</h4>
            <ul className="mt-4 space-y-2">
              {empresaLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-cream/75 transition-colors hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-cream/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-sm font-bold md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="flex items-center gap-2">
            Feito à mão em Angola
          </p>
        </Container>
      </div>
    </footer>
  );
}
