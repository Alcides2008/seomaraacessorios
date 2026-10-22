import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes condicionais e resolve conflitos do Tailwind.
 * Ex.: cn("px-2", isActive && "px-4") => "px-4"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor em Kwanza angolano (Kz).
 * Ex.: formatPrice(12500) => "12.500 Kz"
 */
export function formatPrice(value: number): string {
  const formatted = new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} Kz`;
}
