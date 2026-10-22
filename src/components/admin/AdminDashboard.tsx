"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Coins } from "lucide-react";
import { getAllProducts } from "@/lib/products-db";
import { getAllOrders } from "@/lib/firestore";
import { formatPrice } from "@/lib/utils";

export function AdminDashboard() {
  const [s, setS] = useState({ products: 0, orders: 0, sales: 0, loading: true });

  useEffect(() => {
    (async () => {
      const [products, orders] = await Promise.all([
        getAllProducts(),
        getAllOrders().catch(() => []),
      ]);
      // só conta o que já foi pago (não "Aguarda pagamento" nem "Cancelado")
      const PAID = ["Pago", "Em processamento", "Enviado", "Entregue"];
      const sales = orders
        .filter((o) => PAID.includes(o.status))
        .reduce((acc, o) => acc + (o.total || 0), 0);
      setS({ products: products.length, orders: orders.length, sales, loading: false });
    })();
  }, []);

  const cards = [
    { label: "Produtos", value: String(s.products), icon: Package, href: "/admin/produtos" },
    { label: "Encomendas", value: String(s.orders), icon: ShoppingCart, href: "/admin/encomendas" },
    { label: "Vendas pagas", value: formatPrice(s.sales), icon: Coins, href: "/admin/encomendas" },
  ];

  return (
    <div>
      <h1 className="text-5xl text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Resumo da sua loja.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-[1.6rem] border-2 border-ink bg-white p-6 shadow-[5px_5px_0_var(--color-shadow)] transition-transform"
          >
            <c.icon className="h-6 w-6 text-gold" />
            <p className="mt-4 font-display text-3xl font-black text-ink">
              {s.loading ? "…" : c.value}
            </p>
            <p className="text-sm font-bold text-ink/60">
              {c.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
