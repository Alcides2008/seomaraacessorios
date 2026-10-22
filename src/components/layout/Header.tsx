"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getSiteContent, defaultContent } from "@/lib/content";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Loja", href: "/loja", mega: true },
  { label: "Sobre", href: "/sobre" },
  { label: "Contacto", href: "/contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { count: cartCount, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const [announcement, setAnnouncement] = useState(defaultContent.announcement);

  useEffect(() => {
    getSiteContent()
      .then((c) => setAnnouncement(c.announcement))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // bloqueia o scroll do corpo quando há overlay aberto
  useEffect(() => {
    const lock = mobileOpen || searchOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const ticker = Array.from({ length: 6 }, () => announcement);

  return (
    <>
      {/* Faixa de anúncio em marquee */}
      <div className="overflow-hidden border-b-2 border-ink bg-gold text-ink">
        <div className="flex w-max animate-marquee gap-10 py-1.5">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="whitespace-nowrap text-xs font-black uppercase tracking-wider">
              ✦ {t}
            </span>
          ))}
        </div>
      </div>

      {/* Barra flutuante tipo autocolante */}
      <header className="sticky top-0 z-50 px-3 pt-3" onMouseLeave={() => setMegaOpen(false)}>
        <div
          className={cn(
            "container-siomara relative flex h-16 items-center justify-between gap-3 rounded-full border-2 border-ink bg-white/95 backdrop-blur-md transition-shadow duration-300 md:h-[4.5rem]",
            scrolled ? "shadow-[5px_5px_0_var(--color-shadow)]" : "shadow-[3px_3px_0_var(--color-shadow)]",
          )}
          style={{ paddingInline: "0.9rem" }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-sand lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setMegaOpen(!!l.mega)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-extrabold transition-colors hover:bg-sand",
                  isActive(l.href) ? "bg-sand text-ink" : "text-ink/70",
                )}
              >
                {l.label}
                {l.mega && (
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform duration-300", megaOpen && "rotate-180")}
                  />
                )}
              </Link>
            ))}
            <Link
              href="/criar"
              onMouseEnter={() => setMegaOpen(false)}
              className="ml-2 rotate-[-2deg] rounded-full border-2 border-ink bg-butter px-4 py-1.5 text-sm font-black text-ink shadow-[3px_3px_0_var(--color-shadow)] transition-transform hover:rotate-0 hover:scale-105"
            >
              Atelier ✦ crie a sua
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <IconBtn onClick={() => setSearchOpen(true)} label="Pesquisar">
              <Search className="h-5 w-5" />
            </IconBtn>
            <Link href="/conta" aria-label="A minha conta" className="hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-sand sm:flex">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/favoritos" aria-label="Favoritos" className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-sand sm:flex">
              <Heart className="h-5 w-5" />
              <CountBadge count={wishCount} />
            </Link>
            <button
              onClick={openCart}
              aria-label="Abrir carrinho"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-gold text-ink transition-transform hover:-rotate-6"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <CountBadge count={cartCount} />
            </button>
          </div>
        </div>

        <MegaMenu open={megaOpen} onLinkClick={() => setMegaOpen(false)} />
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function IconBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-sand"
    >
      {children}
    </button>
  );
}

/** Contador animado para os ícones (carrinho / favoritos). */
function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-butter px-1 text-[10px] font-black text-ink"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
