"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PersonnelPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-command-ink mb-2">Personnels</h1>
        <p className="text-gray-600 mb-8">Gestion du personnel et des ressources humaines</p>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <p className="text-gray-500">Page en construction...</p>
        </div>
      </div>
    </main>
  );
}
