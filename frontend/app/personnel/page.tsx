import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search } from "lucide-react";

export default function PersonnelPage() {
  return (
    <AppShell title="Gestion des personnels" subtitle="Profils, grades, unites, disponibilite et recherche multicritere">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Effectif actif", "4 280"],
          ["Disponibles", "3 176"],
          ["En formation", "312"],
          ["Indisponibles", "126"]
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
          <CardTitle>Recherche multicritere</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Nom, matricule, competence</span>
          </div>
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Grade
          </Button>
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Unite
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Nouveau
          </Button>
        </CardContent>
      </Card>

      <DataTable
        title="Liste des personnels"
        columns={["Matricule", "Nom", "Grade", "Unite", "Disponibilite", "Statut"]}
        rows={[
          ["MFA-0001", "Andry Rabe", "Capitaine", "1er RFI", "Disponible", "Operationnel"],
          ["MFA-0148", "Mamy Rakoto", "Lieutenant", "2e BIA", "Affecte", "Mission"],
          ["MFA-0320", "Hery Rasoanaivo", "Sergent", "Logistique", "Formation", "Actif"]
        ]}
      />
    </AppShell>
  );
}

