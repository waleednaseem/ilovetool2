"use client";

import { AppProvider, FavoritesProvider } from "@/context";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </AppProvider>
  );
}
