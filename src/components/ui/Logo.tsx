import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** Logótipo da Siomara (wordmark rosa com brilhos, fundo transparente). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} — loja`} className={cn("block", className)}>
      <Image
        src="/logo-siomara.png"
        alt={siteConfig.name}
        width={900}
        height={435}
        priority
        className="h-14 w-auto md:h-16"
      />
    </Link>
  );
}
