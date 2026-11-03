import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-gold-deep",
  gold: "bg-gold-deep text-white hover:bg-ink",
  outline: "border border-edge bg-white text-ink hover:border-ink hover:bg-sand",
  ghost: "text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

/** Gera as classes de um botão — útil para aplicar o estilo a <Link> também. */
export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 ease-premium disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  );
}
