"use client";

import * as React from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { useAuthStore } from "@/store/auth-store";

function AuthBootstrap() {
  const initialize = useAuthStore((state) => state.initialize);

  React.useEffect(() => {
    void initialize();
  }, [initialize]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthBootstrap />
      {children}
    </ThemeProvider>
  );
}
