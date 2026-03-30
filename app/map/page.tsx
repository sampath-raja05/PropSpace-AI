import dynamic from "next/dynamic";

import { PageShell } from "@/components/layout/page-shell";
import { getAllProperties } from "@/lib/api";

const MapExperience = dynamic(
  () => import("@/components/map/map-experience").then((module) => module.MapExperience),
  {
    ssr: false
  }
);

export default async function MapPage() {
  const properties = await getAllProperties();

  return (
    <PageShell>
      <MapExperience properties={properties} />
    </PageShell>
  );
}
