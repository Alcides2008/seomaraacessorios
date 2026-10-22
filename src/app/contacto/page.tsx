import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PaymentInfo } from "@/components/checkout/PaymentInfo";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/SocialIcons";

export const metadata: Metadata = { title: "Contacto" };

const methods = [
  {
    label: "WhatsApp",
    value: siteConfig.contact.phone,
    href: whatsappUrl("Olá Siomara Acessórios! Gostaria de mais informações."),
    icon: WhatsAppIcon,
  },
  {
    label: "Telefone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
    icon: Phone,
  },
  {
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
  },
  {
    label: "Instagram",
    value: siteConfig.social.instagramHandle,
    href: siteConfig.social.instagram,
    icon: InstagramIcon,
  },
].filter((m) => m.value);

export default function ContactoPage() {
  return (
    <main className="flex-1 py-10 md:py-14">
      <Container>
        <Breadcrumb
          items={[{ label: "Início", href: "/" }, { label: "Contacto" }]}
        />
        <span className="tracking-luxe mt-5 block text-xs uppercase text-gold">
          Fale connosco
        </span>
        <h1 className="mt-2 font-display text-3xl text-ink md:text-4xl">
          Contacto
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Estamos disponíveis para o ajudar com encomendas, dúvidas sobre
          produtos ou pagamentos. O mais rápido é pelo WhatsApp.
        </p>

        {/* Métodos de contacto */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map(({ label, value, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-sm border border-line p-6 transition-colors hover:border-ink"
            >
              <Icon className="h-6 w-6 text-gold" />
              <span className="tracking-luxe text-[11px] uppercase text-muted">
                {label}
              </span>
              <span className="text-sm text-ink transition-colors group-hover:text-gold-deep">
                {value}
              </span>
            </Link>
          ))}
        </div>

        {/* Dados de pagamento */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl text-ink">Dados de pagamento</h2>
          <p className="mt-2 text-sm text-muted">
            Pode pagar por Multicaixa Express ou por Referência (no ATM ou
            Internet Banking).
          </p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div>
              <span className="tracking-luxe text-[11px] uppercase text-ink">
                Multicaixa Express
              </span>
              <div className="mt-3">
                <PaymentInfo method="multicaixa-express" showNote={false} />
              </div>
            </div>
            <div>
              <span className="tracking-luxe text-[11px] uppercase text-ink">
                Referência
              </span>
              <div className="mt-3">
                <PaymentInfo method="referencia" showNote={false} />
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted">
            Após o pagamento, envie o comprovativo por WhatsApp para
            confirmarmos a sua encomenda.
          </p>
        </section>
      </Container>
    </main>
  );
}
