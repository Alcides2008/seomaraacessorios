import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Trust } from "@/components/home/Trust";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { getAllProducts } from "@/lib/products-db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await getAllProducts();
  const bestsellers = all.filter((p) => p.bestseller).slice(0, 8);
  const novidades = all.filter((p) => p.isNew).slice(0, 8);

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Trust />
      <CategoryShowcase />
      <ProductCarousel
        eyebrow="as mais pedidas"
        title="Favoritas da casa"
        products={bestsellers}
        viewAll={{ label: "Ver toda a loja", href: "/loja" }}
      />
      <NewArrivals products={novidades} />
      <PromoBanner />
      <InstagramFeed />
    </main>
  );
}
