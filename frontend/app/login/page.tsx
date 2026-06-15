import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-command-ink p-5">
      <Card className="w-full max-w-md border-white/10 bg-white">
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-command-ink">MFA Decision</h1>
              <p className="text-sm text-slate-500">Connexion securisee</p>
            </div>
          </div>
          <div className="space-y-3">
            <input className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Email" />
            <input
              className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm"
              placeholder="Mot de passe"
              type="password"
            />
          </div>
          <Button className="w-full">Se connecter</Button>
          <p className="text-xs text-slate-500">Compte demo : admin@mfa.local / Admin@12345</p>
        </CardContent>
      </Card>
    </main>
  );
}

