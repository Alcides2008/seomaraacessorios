import { permanentRedirect } from "next/navigation";

// A loja vive em "/" — mantém os links antigos (/loja) a funcionar.
export default function LojaPage() {
  permanentRedirect("/");
}
