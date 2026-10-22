import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { DEFAULT_PRICES, mergePrices, type AtelierPrices } from "@/lib/atelier";

// mesmo sítio que o resto do conteúdo editável (regras: todos leem, só o ADM grava)
const ref = () => doc(db, "content", "atelier");

/** Preços do Atelier gravados no painel; os de origem se não houver ou falhar a rede. */
export async function getAtelierPrices(): Promise<AtelierPrices> {
  if (!isFirebaseConfigured) return DEFAULT_PRICES;
  try {
    const snap = await getDoc(ref());
    return mergePrices(snap.exists() ? snap.data() : null);
  } catch {
    return DEFAULT_PRICES;
  }
}

export async function saveAtelierPrices(prices: AtelierPrices): Promise<void> {
  await setDoc(ref(), mergePrices(prices));
}
