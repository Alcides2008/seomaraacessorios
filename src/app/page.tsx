import { getAllProducts } from "@/lib/products-db";
import { CatalogView } from "@/components/shop/CatalogView";

export const dynamic = "force-dynamic";

// O site abre direto na loja (pedido da Siomara): não há página inicial à parte.
export default async function LojaHome() {
  const products = await getAllProducts();
  return (
    <CatalogView
      products={products}
      eyebrow="feito à mão em Angola"
      title="A loja"
      tagline="Transformando amor em pulseiras"
      breadcrumb={[]}
    />
  );
}
