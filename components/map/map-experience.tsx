"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPinned, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { GlassCard } from "@/components/ui/glass-card";
import type { Property } from "@/types";
import { cn, formatCompactCurrency, formatScore } from "@/lib/utils";

const PropertyMap = dynamic(
  () => import("@/components/map/property-map").then((module) => module.PropertyMap),
  {
    ssr: false
  }
);

export function MapExperience({ properties }: { properties: Property[] }) {
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>(properties.map((property) => property.id));
  const [focusedPropertyId, setFocusedPropertyId] = useState<string | null>(null);
  const requestedProperty = searchParams.get("property")?.toLowerCase() ?? null;

  useEffect(() => {
    setSelectedIds(properties.map((property) => property.id));
  }, [properties]);

  const requestedMapProperty = useMemo(
    () =>
      requestedProperty
        ? properties.find((property) => property.id === requestedProperty || property.slug === requestedProperty) ?? null
        : null,
    [properties, requestedProperty]
  );

  useEffect(() => {
    if (requestedMapProperty) {
      setFocusedPropertyId(requestedMapProperty.id);
    }
  }, [requestedMapProperty]);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedProperties = useMemo(
    () =>
      properties
        .filter((property) => selectedIdSet.has(property.id))
        .sort((left, right) => {
          if (left.id === focusedPropertyId) {
            return -1;
          }

          if (right.id === focusedPropertyId) {
            return 1;
          }

          return right.aiInvestmentScore - left.aiInvestmentScore;
        }),
    [focusedPropertyId, properties, selectedIdSet]
  );

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.6fr_0.75fr]">
      <div className="glass-panel h-[60vh] min-h-[360px] p-2 sm:h-[72vh] sm:min-h-[420px] sm:p-3">
        <div className="mb-3 flex flex-col gap-3 px-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="hero-chip">
              <MapPinned className="h-3.5 w-3.5" />
              Polygon search enabled
            </p>
            <h1 className="mt-3 text-2xl sm:text-4xl">Full-screen map intelligence</h1>
          </div>
          <div className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            {selectedProperties.length} matches
          </div>
        </div>
        <PropertyMap
          properties={properties}
          onSelectionChange={setSelectedIds}
          focusedPropertyId={focusedPropertyId}
          onFocusedPropertyChange={setFocusedPropertyId}
        />
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <p className="hero-chip">
            <Sparkles className="h-3.5 w-3.5" />
            Map tips
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>Draw a polygon on the map to isolate neighborhoods or corridors.</li>
            <li>Marker clusters separate into price chips as you zoom in.</li>
            <li>Click a marker or shortlist card to jump into deeper property details.</li>
          </ul>
        </GlassCard>

        {requestedMapProperty ? (
          <GlassCard className="p-5">
            <p className="hero-chip">Focused property</p>
            <h2 className="mt-3 text-2xl">{requestedMapProperty.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {requestedMapProperty.locality}, {requestedMapProperty.city}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              The map is centered on this listing so you can inspect nearby opportunities before opening the detail page.
            </p>
          </GlassCard>
        ) : null}

        <div className="space-y-3">
          {selectedProperties.slice(0, 6).map((property) => (
            <Link key={property.id} href={`/properties/${property.slug}`} className="block">
              <GlassCard
                className={cn(
                  "p-4 transition-all duration-300 hover:-translate-y-0.5",
                  property.id === focusedPropertyId && "border-primary/40 bg-primary/5"
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl">{property.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.locality}, {property.city}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {property.propertyType} | {property.bhk > 0 ? `${property.bhk} BHK` : "Flexible plan"} | AI {formatScore(property.aiInvestmentScore)}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-lg font-semibold">{formatCompactCurrency(property.price)}</p>
                    <span className="mt-2 inline-block text-sm font-medium text-primary">Open property</span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
