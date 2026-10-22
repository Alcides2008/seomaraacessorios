"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Category } from "@/types";
import { categories as defaultCategories } from "@/config/site";
import { getCategories } from "@/lib/categories-db";

const CategoriesContext = createContext<Category[]>(defaultCategories);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  // começa com as categorias base (sem flash), depois atualiza do Firestore
  const [cats, setCats] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    getCategories()
      .then((c) => c.length && setCats(c))
      .catch(() => {});
  }, []);

  return (
    <CategoriesContext.Provider value={cats}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => useContext(CategoriesContext);
