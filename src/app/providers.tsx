"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CategoriesProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </CategoriesProvider>
    </AuthProvider>
  );
}
