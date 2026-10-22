import { getAllProducts } from "@/lib/products-db";
import { CatalogView } from "@/components/shop/CatalogView";

export const metadata = { title: "Loja" };
export const dynamic = "force-dynamic";

export default async function LojaPage() {
  const products = await getAllProducts();
  return (
    <CatalogView
      products={products}
      eyebrow="tudo feito à mão"
      title="Toda a loja"
      breadcrumb={[{ label: "Início", href: "/" }, { label: "Loja" }]}
    />
  );
}
