"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { FacebookIcon } from "@/components/ui/SocialIcons";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.08-8.09 8.08a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.03 8.03 0 0 1-1.26-4.35c0-4.46 3.63-8.08 8.09-8.08zm-2.6 4.34c-.12 0-.32.05-.49.24-.17.18-.65.63-.65 1.54s.66 1.79.76 1.91c.1.12 1.31 2 3.18 2.81 1.55.67 1.87.54 2.2.5.33-.03 1.08-.44 1.23-.86.15-.42.15-.78.1-.86-.04-.07-.16-.12-.34-.21-.18-.09-1.08-.53-1.25-.59-.17-.06-.29-.09-.41.09-.12.18-.47.59-.58.71-.1.12-.21.13-.39.04-.18-.09-.77-.28-1.46-.9-.54-.48-.9-1.08-1.01-1.26-.1-.18-.01-.28.08-.37.08-.08.18-.21.27-.32.09-.11.12-.18.18-.31.06-.12.03-.23-.01-.32-.05-.09-.41-1-.56-1.37-.15-.36-.3-.31-.41-.31z" />
    </svg>
  );
}

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const open = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer");

  const shareWhatsApp = () =>
    open(
      `https://wa.me/?text=${encodeURIComponent(`${title} — ${window.location.href}`)}`,
    );
  const shareFacebook = () =>
    open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard indisponível */
    }
  };

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold";

  return (
    <div className="flex items-center gap-3">
      <span className="tracking-luxe text-[11px] uppercase text-muted">
        Partilhar
      </span>
      <button onClick={shareWhatsApp} aria-label="Partilhar no WhatsApp" className={btn}>
        <WhatsAppIcon className="h-4 w-4" />
      </button>
      <button onClick={shareFacebook} aria-label="Partilhar no Facebook" className={btn}>
        <FacebookIcon className="h-4 w-4" />
      </button>
      <button onClick={copy} aria-label="Copiar ligação" className={btn}>
        {copied ? <Check className="h-4 w-4 text-gold" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
