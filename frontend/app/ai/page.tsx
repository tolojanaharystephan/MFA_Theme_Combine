import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BrainCircuit, Gauge } from "lucide-react";
import type { ElementType } from "react";

const aiStats: Array<{ label: string; value: string; icon: ElementType }> = [
  { label: "Scoring affectation", value: "92%", icon: BrainCircuit },
  { label: "Risque operationnel", value: "HIGH", icon: Gauge },
  { label: "Anomalies detectees", value: "7", icon: AlertTriangle }
];

export default function AiPage() {
  return (
    <AppShell title="Analyse IA" subtitle="Scoring, recommandations et detection d'anomalies explicables">
      <section className="grid gap-5 lg:grid-cols-3">
        {aiStats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs uppercase text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-command-ink">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recommandations expliquees</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            "Prioriser les profils certifies transmission pour la mission critique.",
            "Reduire la charge de l'unite logistique avant nouvelle affectation.",
            "Prevoir une reserve operationnelle pour OP-2026-003."
          ].map((item) => (
            <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {item}
            </div>
          ))}
          <Button className="w-fit">
            <BrainCircuit className="h-4 w-4" />
            Relancer analyse
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
