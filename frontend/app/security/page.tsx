import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { LockKeyhole, ShieldCheck, UserCog } from "lucide-react";
import type { ElementType } from "react";

const securityStats: Array<{ label: string; value: string; icon: ElementType }> = [
  { label: "RBAC actif", value: "18 permissions", icon: ShieldCheck },
  { label: "Sessions", value: "JWT + refresh", icon: LockKeyhole },
  { label: "Utilisateurs", value: "7 roles", icon: UserCog }
];

export default function SecurityPage() {
  return (
    <AppShell title="Securite" subtitle="RBAC, audit logs, sessions et controle des acces">
      <section className="grid gap-4 md:grid-cols-3">
        {securityStats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent>
              <Icon className="h-6 w-6 text-primary" />
              <p className="mt-4 text-xs uppercase text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-bold text-command-ink">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <DataTable
        title="Audit logs recents"
        columns={["Action", "Entite", "Utilisateur", "Adresse IP", "Date"]}
        rows={[
          ["LOGIN_SUCCESS", "User", "admin@mfa.local", "127.0.0.1", "2026-05-25 10:30"],
          ["CREATE_OPERATION", "Operation", "ops@mfa.local", "127.0.0.1", "2026-05-25 10:12"],
          ["GENERATE_REPORT", "Report", "analyst@mfa.local", "127.0.0.1", "2026-05-25 09:48"]
        ]}
      />
    </AppShell>
  );
}
