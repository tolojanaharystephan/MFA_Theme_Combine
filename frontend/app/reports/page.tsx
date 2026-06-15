import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Plus } from "lucide-react";

export default function ReportsPage() {
  return (
    <AppShell title="Rapports" subtitle="Generation PDF, syntheses periodiques et exports decisionnels">
      <Card>
        <CardHeader>
          <CardTitle>Generer un rapport</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">Rapports disponibles : personnel, unite, operation, mission, analytics.</p>
          <Button>
            <Plus className="h-4 w-4" />
            Nouveau rapport
          </Button>
        </CardContent>
      </Card>

      <DataTable
        title="Rapports generes"
        columns={["Titre", "Type", "Auteur", "Date", "Action"]}
        rows={[
          ["Synthese operations Mai", "ANALYTICS", "Analyste", "2026-05-25", "Telecharger"],
          ["Rapport OP-2026-001", "OPERATION", "Ops Centre", "2026-05-20", "Telecharger"],
          ["Etat effectifs 1er RFI", "UNIT", "RH", "2026-05-18", "Telecharger"]
        ]}
      />

      <Card>
        <CardContent className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm text-slate-600">Les exports sont audites et accessibles selon permissions.</span>
          <Button variant="secondary" className="ml-auto">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}

