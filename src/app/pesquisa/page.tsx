import { Suspense } from "react";
import { SearchResults } from "@/components/shop/SearchResults";

export const metadata = { title: "Pesquisa" };

export default function PesquisaPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
