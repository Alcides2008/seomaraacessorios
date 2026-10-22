import { redirect } from "next/navigation";

// Peças criadas no Atelier aparecem no carrinho com o slug "atelier".
export default function AtelierProductPage() {
  redirect("/criar");
}
