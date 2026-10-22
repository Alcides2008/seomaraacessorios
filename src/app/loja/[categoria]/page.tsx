import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories-db";
import { getProductsByCategoryDb } from "@/lib/products-db";
import { CatalogView } from "@/components/shop/CatalogView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const cat = (await getCategories()).find((c) => c.slug === categoria);
  return { title: cat?.name ?? "Categoria" };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const cat = (await getCategories()).find((c) => c.slug === categoria);

  if (!cat) notFound();

  const categoryProducts = await getProductsByCategoryDb(cat.slug);

  return (
    <CatalogView
      products={categoryProducts}
      eyebrow="coleção"
      title={cat.name}
      fixedCategory={cat.slug}
      breadcrumb={[
        { label: "Início", href: "/" },
        { label: "Loja", href: "/loja" },
        { label: cat.name },
      ]}
    />
  );
}
