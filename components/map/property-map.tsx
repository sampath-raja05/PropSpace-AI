"use client";

import { useEffect, useMemo, useState } from "react";
import type { LatLngExpression, PathOptions } from "leaflet";
import L from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import type { Property } from "@/types";
import { cn, formatCompactCurrency, formatScore } from "@/lib/utils";

const polygonStyle: PathOptions = {
  color: "rgb(5, 150, 105)",
  fillColor: "rgba(16, 185, 129, 0.18)",
  fillOpacity: 0.35,
  weight: 2
};

function pointInPolygon(point: [number, number], polygon: [number, number][]) {
  let inside = false;

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const xi = polygon[index][0];
    const yi = polygon[index][1];
    const xj = polygon[previous][0];
    const yj = polygon[previous][1];

    const intersect = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

function buildPriceIcon(property: Property, isFocused = false) {
  const background = isFocused ? "rgba(5, 150, 105, 0.96)" : "rgba(15, 23, 42, 0.85)";
  const border = isFocused ? "2px solid rgba(167, 243, 208, 0.95)" : "1px solid rgba(255,255,255,0.15)";
  const shadow = isFocused ? "0 12px 36px rgba(5, 150, 105, 0.35)" : "0 10px 26px rgba(15, 23, 42, 0.22)";

  return L.divIcon({
    className: "price-icon",
    html: `<div style="padding:8px 12px;border-radius:999px;background:${background};color:white;font-weight:600;font-size:12px;backdrop-filter:blur(10px);border:${border};box-shadow:${shadow};transform:${isFocused ? "scale(1.08)" : "scale(1)"};">${formatCompactCurrency(property.price)}</div>`,
    iconAnchor: [42, 18]
  });
}

function FocusedPropertyViewport({ property }: { property: Property | null }) {
  const map = useMap();

  useEffect(() => {
    if (!property) {
      return;
    }

    map.flyTo([property.latitude, property.longitude], Math.max(map.getZoom(), 12), {
      animate: true,
      duration: 0.75
    });
  }, [map, property]);

  return null;
}

function MapDrawControl({
  onPolygonChange
}: {
  onPolygonChange: (polygon: [number, number][] | null) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const featureGroup = new L.FeatureGroup();
    map.addLayer(featureGroup);
    let drawControl: L.Control | null = null;

    let mounted = true;

    void import("leaflet-draw").then(() => {
      if (!mounted) {
        return;
      }

      const DrawControl = (L.Control as unknown as { Draw: new (config: object) => L.Control }).Draw;
      drawControl = new DrawControl({
        edit: {
          featureGroup
        },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true
          },
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false
        }
      });

      map.addControl(drawControl);
    });

    const readLayer = (layer: L.Layer) => {
      const latLngs = (layer as L.Polygon).getLatLngs?.();
      const firstRing = Array.isArray(latLngs) ? (latLngs[0] as L.LatLng[]) : [];

      if (!firstRing || firstRing.length === 0) {
        onPolygonChange(null);
        return;
      }

      onPolygonChange(firstRing.map((latLng) => [latLng.lng, latLng.lat]));
    };

    const handleCreated: L.LeafletEventHandlerFn = (event) => {
      const createdEvent = event as L.LeafletEvent & { layer: L.Layer };
      featureGroup.clearLayers();
      featureGroup.addLayer(createdEvent.layer);
      readLayer(createdEvent.layer);
    };

    const handleEdited: L.LeafletEventHandlerFn = (event) => {
      const editedEvent = event as L.LeafletEvent & { layers: L.LayerGroup };
      editedEvent.layers.eachLayer((layer) => readLayer(layer));
    };

    const handleDeleted: L.LeafletEventHandlerFn = () => onPolygonChange(null);

    map.on("draw:created", handleCreated);
    map.on("draw:edited", handleEdited);
    map.on("draw:deleted", handleDeleted);

    return () => {
      mounted = false;
      if (drawControl) {
        map.removeControl(drawControl);
      }
      map.off("draw:created", handleCreated);
      map.off("draw:edited", handleEdited);
      map.off("draw:deleted", handleDeleted);
      map.removeLayer(featureGroup);
    };
  }, [map, onPolygonChange]);

  return null;
}

export function PropertyMap({
  properties,
  onSelectionChange,
  focusedPropertyId,
  onFocusedPropertyChange
}: {
  properties: Property[];
  onSelectionChange?: (ids: string[]) => void;
  focusedPropertyId?: string | null;
  onFocusedPropertyChange?: (id: string) => void;
}) {
  const [polygon, setPolygon] = useState<[number, number][] | null>(null);
  const focusedProperty = useMemo(
    () => properties.find((property) => property.id === focusedPropertyId) ?? null,
    [focusedPropertyId, properties]
  );

  useEffect(() => {
    if (!onSelectionChange) {
      return;
    }

    if (!polygon) {
      onSelectionChange(properties.map((property) => property.id));
      return;
    }

    const selectedIds = properties
      .filter((property) => pointInPolygon([property.longitude, property.latitude], polygon))
      .map((property) => property.id);

    onSelectionChange(selectedIds);
  }, [onSelectionChange, polygon, properties]);

  const polygonLatLngs = useMemo<LatLngExpression[] | null>(
    () => (polygon ? polygon.map(([lng, lat]) => [lat, lng]) : null),
    [polygon]
  );
  const markerIcons = useMemo(
    () =>
      new Map(properties.map((property) => [property.id, buildPriceIcon(property, property.id === focusedPropertyId)])),
    [focusedPropertyId, properties]
  );

  return (
    <div className="h-full w-full overflow-hidden rounded-[28px] border border-white/20">
      <MapContainer
        center={focusedProperty ? [focusedProperty.latitude, focusedProperty.longitude] : [20.5937, 78.9629]}
        zoom={focusedProperty ? 12 : 5}
        zoomControl={false}
        preferCanvas
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading>
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={markerIcons.get(property.id)}
              eventHandlers={{
                click: () => onFocusedPropertyChange?.(property.id)
              }}
            >
              <Popup>
                <div className="w-52 max-w-[calc(100vw-7rem)] space-y-3">
                  <div className="space-y-1">
                    <p className="font-semibold">{property.title}</p>
                    <p className="text-sm opacity-80">
                      {property.locality}, {property.city}
                    </p>
                    <p className="text-sm">{formatCompactCurrency(property.price)}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
                      AI {formatScore(property.aiInvestmentScore)}/100
                    </p>
                  </div>
                  <Link
                    href={`/properties/${property.slug}`}
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    View property details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        {polygonLatLngs ? <Polygon positions={polygonLatLngs} pathOptions={polygonStyle} /> : null}
        <MapDrawControl onPolygonChange={setPolygon} />
        <FocusedPropertyViewport property={focusedProperty} />
      </MapContainer>
    </div>
  );
}
