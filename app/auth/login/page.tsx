import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/layout/page-shell";

export default function LoginPage() {
  return (
    <PageShell className="py-12">
      <AuthForm mode="login" />
    </PageShell>
  );
}
