import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Category } from "@/types";
import { categories as defaultCategories } from "@/config/site";

const COL = "categories";

const sortCats = (l: Category[]) =>
  [...l].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name),
  );

/** Categorias do Firestore; reserva para as do config quando vazio/offline. */
export async function getCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured) return sortCats(defaultCategories);
  try {
    const snap = await getDocs(collection(db, COL));
    if (snap.empty) return sortCats(defaultCategories);
    return sortCats(snap.docs.map((d) => d.data() as Category));
  } catch {
    return sortCats(defaultCategories);
  }
}

export async function saveCategory(c: Category): Promise<void> {
  await setDoc(doc(db, COL, c.slug), JSON.parse(JSON.stringify(c)));
}

export async function deleteCategoryDb(slug: string): Promise<void> {
  await deleteDoc(doc(db, COL, slug));
}

export async function isCategoriesSeeded(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, COL));
    return !snap.empty;
  } catch {
    return false;
  }
}

/** Importa para o Firestore as categorias em falta (não sobrescreve). */
export async function seedCategories(): Promise<number> {
  const snap = await getDocs(collection(db, COL));
  const existing = new Set(snap.docs.map((d) => d.id));
  let added = 0;
  for (const c of defaultCategories) {
    if (!existing.has(c.slug)) {
      await setDoc(doc(db, COL, c.slug), JSON.parse(JSON.stringify(c)));
      added++;
    }
  }
  return added;
}
