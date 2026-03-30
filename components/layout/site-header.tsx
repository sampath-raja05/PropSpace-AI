"use client";

import Image from "next/image";
import Link from "next/link";
import { LoaderCircle, LogOut, Menu, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Discover" },
  { href: "/map", label: "Map" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/alerts", label: "Alerts" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);

  const isAuthenticated = status === "authenticated" && user;
  const userInitial = user?.name.trim().charAt(0).toUpperCase() ?? "P";

  return (
    <header className="section-shell sticky top-3 z-40 sm:top-4">
      <div className="glass-card flex items-center justify-between gap-3 rounded-[28px] px-3 py-3 sm:rounded-full sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight sm:text-base">PropSpace AI</p>
            <p className="hidden text-xs text-muted-foreground sm:block">AI real estate intelligence</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors duration-300 hover:bg-white/70 hover:text-foreground dark:hover:bg-slate-800/70",
                pathname === item.href ? "bg-white/80 text-foreground dark:bg-slate-800/80" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </div>
          ) : isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
                aria-label="Open account menu"
              >
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.name} width={44} height={44} className="h-full w-full object-cover" />
                ) : (
                  <span>{userInitial}</span>
                )}
              </button>

              {menuOpen ? (
                <div className="glass-card absolute right-0 top-[calc(100%+0.85rem)] w-72 rounded-[24px] p-3">
                  <div className="rounded-[20px] bg-white/55 p-4 dark:bg-slate-800/55">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-primary">{user.provider} sign-in</p>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-white/70 hover:text-foreground dark:hover:bg-slate-800/70"
                    >
                      Open dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start rounded-2xl px-4"
                      onClick={() => {
                        setMenuOpen(false);
                        void logout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 lg:hidden",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="glass-card mt-3 rounded-[24px] p-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-white/70 hover:text-foreground dark:hover:bg-slate-800/70",
                  pathname === item.href ? "bg-white/80 text-foreground dark:bg-slate-800/80" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <ThemeToggle />
            {status === "loading" ? (
              <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt={user.name} width={40} height={40} className="h-full w-full object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-primary"
                  onClick={() => {
                    setOpen(false);
                    void logout();
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm font-medium text-primary">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
