import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ShieldCheck } from "lucide-react";

export default function OperationsPage() {
  return (
    <AppShell title="Operations" subtitle="Planification, priorite, zones et suivi strategique">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Planifiees", 8],
          ["En cours", 12],
          ["Critiques", 4],
          ["Terminees", 27]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <p className="text-xs uppercase text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-command-ink">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Creation rapide</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-sm text-slate-600">
            Creer une operation avec objectif, zone, priorite et periode. Les missions detaillees sont ensuite
            rattachees a l'operation.
          </p>
          <Button>
            <Plus className="h-4 w-4" />
            Nouvelle operation
          </Button>
        </CardContent>
      </Card>

      <DataTable
        title="Operations recentes"
        columns={["Code", "Intitule", "Zone", "Priorite", "Statut", "Responsable"]}
        rows={[
          ["OP-2026-001", "Securisation axe national", "Alaotra", "HIGH", "IN_PROGRESS", "Ops Centre"],
          ["OP-2026-002", "Appui logistique", "Antananarivo", "MEDIUM", "PLANNED", "Logistique"],
          ["OP-2026-003", "Surveillance cotiere", "Toamasina", "CRITICAL", "IN_PROGRESS", "Marine"]
        ]}
      />

      <Card>
        <CardContent className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="text-sm text-slate-600">Toutes les modifications operationnelles sont journalisees.</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}

