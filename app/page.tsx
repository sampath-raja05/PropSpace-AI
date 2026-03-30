import { HomeExperience } from "@/components/marketing/home-experience";
import { PageShell } from "@/components/layout/page-shell";
import { getAllProperties } from "@/lib/api";

export default async function HomePage() {
  const properties = await getAllProperties();

  return (
    <PageShell className="max-w-none px-0">
      <HomeExperience properties={properties} />
    </PageShell>
  );
}
