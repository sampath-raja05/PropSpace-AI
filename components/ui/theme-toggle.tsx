"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="glass-card inline-flex items-center gap-3 rounded-full px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5"
    >
      <span className="relative flex h-10 w-20 items-center rounded-full bg-primary/10">
        <span
          className={cn(
            "absolute left-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform duration-300",
            isDark && "translate-x-10"
          )}
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </span>
        <span className="flex w-full items-center justify-between px-3 text-primary/55">
          <Sun className="h-4 w-4" />
          <Moon className="h-4 w-4" />
        </span>
      </span>
      <span className="hidden text-sm font-medium text-foreground sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
