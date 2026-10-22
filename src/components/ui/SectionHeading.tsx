import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Squiggle } from "@/components/ui/Doodles";

/** Cabeçalho de secção: sobretítulo dourado + título editorial (+ link opcional). */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  link,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  link?: { label: string; href: string };
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered
          ? "items-center text-center"
          : "items-start md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-3", centered && "items-center")}>
        {eyebrow && (
          <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-butter px-3 py-0.5 font-hand text-xl font-bold text-ink">
            {eyebrow}
          </span>
        )}
        <h2 className="relative text-4xl text-ink md:text-5xl lg:text-6xl">
          {title}
          <Squiggle className={cn("mt-1 h-3 w-32 text-gold", centered && "mx-auto")} />
        </h2>
        {description && (
          <p className="max-w-xl text-base font-semibold leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-black text-ink shadow-[3px_3px_0_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-gold"
        >
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
