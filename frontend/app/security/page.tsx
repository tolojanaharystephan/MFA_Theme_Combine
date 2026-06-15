"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-command-ink mb-2">Sécurité</h1>
        <p className="text-gray-600 mb-8">Paramètres de sécurité et gestion des accès</p>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <p className="text-gray-500">Page en construction...</p>
        </div>
      </div>
    </main>
  );
}
