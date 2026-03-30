"use client";

import { BadgeCheck, BedDouble, Heart, MapPin, Ruler, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { usePortfolioStore } from "@/store/portfolio-store";
import type { Property } from "@/types";
import { cn, formatCompactCurrency, formatCurrency, formatScore } from "@/lib/utils";

export function PropertyCard({ property }: { property: Property }) {
  const { watchlist, toggleWatchlist } = usePortfolioStore();
  const saved = watchlist.includes(property.id);

  return (
    <article className="glass-panel overflow-hidden transition-transform duration-300 hover:-translate-y-1.5">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw"
          quality={72}
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-slate-950/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {property.heroTag}
          </span>
          <button
            type="button"
            onClick={() => toggleWatchlist(property.id)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white backdrop-blur-md transition-colors duration-300",
              saved && "bg-white text-rose-500"
            )}
            aria-label="Toggle watchlist"
          >
            <Heart className={cn("h-4 w-4", saved && "fill-current")} />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="w-full rounded-2xl bg-slate-950/60 px-3 py-2 text-white backdrop-blur-md sm:w-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Guide Price</p>
            <p className="mt-1 text-lg font-semibold sm:text-xl">{formatCompactCurrency(property.price)}</p>
          </div>
          <div className="hidden rounded-2xl bg-emerald-500/85 px-3 py-2 text-right text-white sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">AI score</p>
            <p className="mt-1 text-xl font-semibold">{formatScore(property.aiInvestmentScore)}/100</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 sm:hidden dark:text-emerald-200">
          AI score {formatScore(property.aiInvestmentScore)}/100
        </div>

        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl leading-tight sm:text-2xl">{property.title}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {property.locality}, {property.city}
              </p>
            </div>
            {property.verified ? (
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : null}
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{property.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-[22px] bg-white/55 p-3 min-[500px]:grid-cols-3 dark:bg-slate-800/45">
          <div className="min-w-0 rounded-2xl bg-background/70 px-3 py-3">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <BedDouble className="h-3.5 w-3.5" />
              BHK
            </p>
            <p className="mt-2 break-words text-base font-semibold sm:text-lg">
              {property.bhk === 0 ? property.propertyType : `${property.bhk} BHK`}
            </p>
          </div>
          <div className="min-w-0 rounded-2xl bg-background/70 px-3 py-3">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Ruler className="h-3.5 w-3.5" />
              Size
            </p>
            <p className="mt-2 break-words text-base font-semibold sm:text-lg">{property.sqft.toLocaleString("en-IN")} sqft</p>
          </div>
          <div className="min-w-0 rounded-2xl bg-background/70 px-3 py-3">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5" />
              Value
            </p>
            <p className="mt-2 break-words text-base font-semibold sm:text-lg">{formatCurrency(property.predictedPrice)}</p>
          </div>
        </div>

        <Link
          href={`/properties/${property.slug}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Explore Property Space
        </Link>
      </div>
    </article>
  );
}
