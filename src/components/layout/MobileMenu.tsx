"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Heart, ShoppingBag } from "lucide-react";
import { categories } from "@/config/site";
import { Logo } from "@/components/ui/Logo";

const EASE = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Atelier ✦ crie a sua", href: "/criar" },
  { label: "Loja", href: "/loja" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contacto", href: "/contacto" },
];

const atalhos = [
  { label: "Conta", href: "/conta", icon: User },
  { label: "Favoritos", href: "/favoritos", icon: Heart },
  { label: "Carrinho", href: "/carrinho", icon: ShoppingBag },
];

/** Menu lateral mobile (gaveta deslizante). */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-cream p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={onClose}
                aria-label="Fechar menu"
                className="text-muted transition-colors hover:text-ink"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-10 flex flex-col">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="border-b border-line py-3 font-display text-2xl text-ink transition-colors hover:text-gold-deep"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <span className="tracking-luxe mt-8 text-[11px] uppercase text-muted/70">
              Categorias
            </span>
            <div className="mt-4 flex flex-col gap-2.5">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/loja/${c.slug}`}
                  onClick={onClose}
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-line pt-6">
              {atalhos.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="tracking-luxe flex flex-col items-center gap-1.5 text-[10px] uppercase text-muted transition-colors hover:text-gold"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
