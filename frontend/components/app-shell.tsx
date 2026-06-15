"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BrainCircuit,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  Shield,
  UsersRound,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/personnel", label: "Personnels", icon: UsersRound },
  { href: "/operations", label: "Operations", icon: Shield },
  { href: "/missions", label: "Missions", icon: ClipboardList },
  { href: "/ai", label: "Analyse IA", icon: BrainCircuit },
  { href: "/reports", label: "Rapports", icon: FileText },
  { href: "/security", label: "Securite", icon: LockKeyhole }
];

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-transparent">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-command-ink text-white lg:block">
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">MFA Decision</p>
              <p className="text-xs text-slate-300">Command analytics</p>
            </div>
          </div>
          <nav className="space-y-1 px-3 py-5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm transition ${
                    active ? "bg-white text-command-ink" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur">
            <div className="flex min-h-20 flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Ministere des Forces Armees
                </p>
                <h1 className="mt-1 text-2xl font-bold text-command-ink">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
              </div>
              <Button>
                <BrainCircuit className="h-4 w-4" />
                Analyse IA
              </Button>
            </div>
          </header>
          <div className="space-y-6 p-5 lg:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
