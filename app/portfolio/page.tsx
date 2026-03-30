import { PortfolioExperience } from "@/components/dashboard/portfolio-experience";
import { PageShell } from "@/components/layout/page-shell";
import { getAllProperties, getPortfolio } from "@/lib/api";

export default async function PortfolioPage() {
  const [holdings, properties] = await Promise.all([getPortfolio(), getAllProperties()]);

  return (
    <PageShell>
      <PortfolioExperience holdings={holdings} properties={properties} />
    </PageShell>
  );
}
