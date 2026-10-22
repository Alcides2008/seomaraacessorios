import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategoryDb } from "@/lib/products-db";
import { getCategories } from "@/lib/categories-db";
import { productGallery } from "@/lib/product-options";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCarousel } from "@/components/home/ProductCarousel";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "Produto",
    description: product?.description,
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const category = (await getCategories()).find(
    (c) => c.slug === product.category,
  )!;
  const gallery = productGallery(product);
  const related = (await getProductsByCategoryDb(product.category))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <main className="flex-1 py-10 md:py-14">
      <Container>
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Loja", href: "/loja" },
            { label: category.name, href: `/loja/${category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={gallery} />
          <ProductDetail product={product} categoryName={category.name} />
        </div>
      </Container>

      {related.length > 0 && (
        <div className="mt-16">
          <ProductCarousel
            eyebrow="Pode também gostar"
            title="Produtos relacionados"
            products={related}
          />
        </div>
      )}
    </main>
  );
}
