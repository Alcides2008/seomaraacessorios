import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Container central do site (largura máxima + padding lateral responsivo). */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("container-siomara", className)}>{children}</div>;
}
