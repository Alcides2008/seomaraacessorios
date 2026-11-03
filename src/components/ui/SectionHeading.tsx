import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <span className="inline-block rounded-full border border-edge bg-butter px-3 py-0.5 font-hand text-xl font-bold text-ink">
            {eyebrow}
          </span>
        )}
        <h2 className="relative text-4xl text-ink md:text-5xl lg:text-6xl">
          {title}
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
          className="group inline-flex items-center gap-2 rounded-full border border-edge bg-white px-4 py-2 text-sm font-semibold text-ink shadow-[0_12px_32px_-22px_rgba(59,34,48,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold"
        >
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
