import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** Logótipo da Siomara: selo do laço + nome em serifada. */
export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — início`}
      className={cn("group flex items-center gap-3", className)}
    >
      <Image
        src="/logo-siomara.jpg"
        alt=""
        width={44}
        height={44}
        priority
        className="h-10 w-10 rounded-full object-cover ring-1 ring-gold/40 transition-transform duration-500 ease-premium group-hover:rotate-[-8deg] md:h-11 md:w-11"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-black italic md:text-2xl",
            tone === "dark" ? "text-ink" : "text-cream",
          )}
        >
          {siteConfig.shortName}
        </span>
        <span className="mt-1 text-[9px] uppercase tracking-[0.32em] text-gold-deep">
          Acessórios
        </span>
      </span>
    </Link>
  );
}
