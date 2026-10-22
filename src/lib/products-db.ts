import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Product } from "@/types";
import { products as seedProducts } from "@/data/products";

const COL = "products";

function sortProducts(list: Product[]): Product[] {
  return [...list].sort(
    (a, b) => Number(a.id) - Number(b.id) || a.name.localeCompare(b.name),
  );
}

/** Remove campos `undefined` (o Firestore não os aceita). */
function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Todos os produtos. Lê do Firestore; se a coleção estiver vazia ou houver
 * erro de rede, usa os 41 produtos locais (data/products.ts) como reserva.
 */
export async function getAllProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured) return sortProducts(seedProducts);
  try {
    const snap = await getDocs(collection(db, COL));
    if (snap.empty) return sortProducts(seedProducts);
    return sortProducts(snap.docs.map((d) => d.data() as Product));
  } catch {
    return sortProducts(seedProducts);
  }
}

/** Já existem produtos no Firestore? (para mostrar o botão de importação) */
export async function isSeeded(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, COL));
    return !snap.empty;
  } catch {
    return false;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategoryDb(
  category: string,
): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === category);
}

export async function saveProduct(product: Product): Promise<void> {
  await setDoc(doc(db, COL, product.id), clean(product));
}

export async function deleteProductDb(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

/**
 * Importa para o Firestore apenas os produtos locais que AINDA não existem
 * (não sobrescreve edições já feitas). Devolve quantos foram adicionados.
 */
export async function seedProductsToFirestore(): Promise<number> {
  const snap = await getDocs(collection(db, COL));
  const existing = new Set(snap.docs.map((d) => d.id));
  let added = 0;
  for (const p of seedProducts) {
    if (!existing.has(p.id)) {
      await setDoc(doc(db, COL, p.id), clean(p));
      added++;
    }
  }
  return added;
}

export const newProductId = () => Date.now().toString();
