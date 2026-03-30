import { BellRing, BriefcaseBusiness, Landmark, TrendingUp } from "lucide-react";

import { AllocationChart } from "@/components/dashboard/allocation-chart";
import { MarketMomentumChart } from "@/components/dashboard/market-momentum-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PortfolioGrowthChart } from "@/components/dashboard/portfolio-growth-chart";
import { PageShell } from "@/components/layout/page-shell";
import { GlassCard } from "@/components/ui/glass-card";
import {
  getAllProperties,
  getCityAllocationSeries,
  getDashboardMetrics,
  getMarketMomentumSeries,
  getPortfolio,
  getPropertyMixSeries
} from "@/lib/api";
import { formatCompactCurrency, formatScore } from "@/lib/utils";

export default async function DashboardPage() {
  const [dashboardMetrics, properties, holdings, marketMomentumSeries, cityAllocationSeries, propertyTypeSeries] =
    await Promise.all([
      getDashboardMetrics(),
      getAllProperties(),
      getPortfolio(),
      getMarketMomentumSeries(),
      getCityAllocationSeries(),
      getPropertyMixSeries()
    ]);
  const topProperty = properties.slice().sort((left, right) => right.aiInvestmentScore - left.aiInvestmentScore)[0];

  return (
    <PageShell className="space-y-8">
      <GlassCard className="p-6 sm:p-8">
        <p className="hero-chip">Dashboard</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">A clean command center for real estate strategy</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Track capital, benchmark market momentum, and surface the next high-conviction move without bouncing between spreadsheets.
        </p>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Portfolio value"
          value={formatCompactCurrency(dashboardMetrics.totalPortfolioValue)}
          description="Current marked value across tracked holdings."
          icon={Landmark}
        />
        <MetricCard
          title="Average yield"
          value={`${dashboardMetrics.averageYield}%`}
          description="Blended rental yield estimate."
          icon={TrendingUp}
        />
        <MetricCard
          title="Watchlist growth"
          value={`${dashboardMetrics.watchlistGrowth}%`}
          description="Month-on-month increase in shortlisted assets."
          icon={BriefcaseBusiness}
        />
        <MetricCard
          title="Active alerts"
          value={dashboardMetrics.activeAlerts.toString()}
          description="Automation rules currently monitoring the market."
          icon={BellRing}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <PortfolioGrowthChart />
        <MarketMomentumChart data={marketMomentumSeries} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AllocationChart
          data={cityAllocationSeries}
          title="Tier allocation"
          description="How your opportunity set currently skews across city maturity."
        />
        <AllocationChart
          data={propertyTypeSeries}
          title="Asset mix"
          description="Current balance between apartments, villas, plots, and commercial assets."
        />
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">AI spotlight</p>
            <h2 className="mt-2 text-3xl">{topProperty.title}</h2>
            <p className="mt-2 text-muted-foreground">
              {topProperty.locality}, {topProperty.city} | {formatScore(topProperty.aiInvestmentScore)}/100 AI score
            </p>
          </div>
          <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
            {holdings.length} tracked holdings
          </div>
        </div>
      </GlassCard>
    </PageShell>
  );
}
