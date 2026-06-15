import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Plus } from "lucide-react";

export default function MissionsPage() {
  return (
    <AppShell title="Missions" subtitle="Affectation des ressources et suivi tactique simplifie">
      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <DataTable
          title="Missions actives"
          columns={["Mission", "Operation", "Risque", "Statut", "Unite"]}
          rows={[
            ["Patrouille nord", "OP-2026-001", "HIGH", "IN_PROGRESS", "1er RFI"],
            ["Transport materiel", "OP-2026-002", "MEDIUM", "PLANNED", "Logistique"],
            ["Observation cotiere", "OP-2026-003", "CRITICAL", "IN_PROGRESS", "Marine"]
          ]}
        />
        <Card>
          <CardContent className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-50 text-primary">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-command-ink">Recommandation IA</h2>
              <p className="mt-2 text-sm text-slate-600">
                Selectionne une mission pour obtenir les personnels et unites les plus adaptes selon competences,
                disponibilite et charge recente.
              </p>
            </div>
            <Button className="w-full">
              <Plus className="h-4 w-4" />
              Affecter ressources
            </Button>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

