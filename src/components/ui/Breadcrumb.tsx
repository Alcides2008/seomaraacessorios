import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs text-muted",
        className,
      )}
    >
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {c.href ? (
            <Link href={c.href} className="transition-colors hover:text-gold">
              {c.label}
            </Link>
          ) : (
            <span className="text-ink">{c.label}</span>
          )}
          {i < items.length - 1 && (
            <ChevronRight className="h-3 w-3 text-muted/50" />
          )}
        </span>
      ))}
    </nav>
  );
}
