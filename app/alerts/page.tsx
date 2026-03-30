import { AlertsExperience } from "@/components/dashboard/alerts-experience";
import { PageShell } from "@/components/layout/page-shell";
import { getAlerts } from "@/lib/api";

export default async function AlertsPage() {
  const alerts = await getAlerts();

  return (
    <PageShell>
      <AlertsExperience alerts={alerts} />
    </PageShell>
  );
}
