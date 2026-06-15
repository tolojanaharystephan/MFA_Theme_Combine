"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  FileText,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Search,
  Shield,
  UsersRound
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardData } from "@/features/dashboard/mock-data";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Personnels", icon: UsersRound, href: "/personnel" },
  { label: "Operations", icon: Shield, href: "/operations" },
  { label: "Analyse IA", icon: BrainCircuit, href: "/ai-analysis" },
  { label: "Rapports", icon: FileText, href: "/reports" },
  { label: "Securite", icon: LockKeyhole, href: "/security" }
];

const pieColors = ["#0f766e", "#0e7490", "#334155"];

export default function DashboardPage() {
  const [chartsReady, setChartsReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setChartsReady(true);
  }, []);

  const isActive = (href: string) => pathname === href;

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
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm transition ${
                  isActive(item.href)
                    ? "bg-white text-command-ink"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur">
            <div className="flex min-h-20 flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Ministere des Forces Armees
                </p>
                <h1 className="mt-1 text-2xl font-bold text-command-ink">Centre decisionnel strategique</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 md:flex">
                  <Search className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">Recherche multicritere</span>
                </div>
                <Button>
                  <BrainCircuit className="h-4 w-4" />
                  Analyse IA
                </Button>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-5 lg:p-8">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-6"
            >
              <KpiCard title="Effectif total" value={dashboardData.kpis.totalPersonnel.toLocaleString("fr-FR")} icon={UsersRound} />
              <KpiCard title="Disponibles" value={dashboardData.kpis.availablePersonnel.toLocaleString("fr-FR")} icon={Gauge} />
              <KpiCard title="Disponibilite" value={`${dashboardData.kpis.availabilityRate}%`} icon={Activity} />
              <KpiCard title="Operations" value={dashboardData.kpis.activeOperations} icon={Shield} />
              <KpiCard title="Critiques" value={dashboardData.kpis.criticalMissions} icon={BarChart3} tone="alert" />
              <KpiCard title="Alertes IA" value={dashboardData.kpis.aiAlerts} icon={BrainCircuit} tone="cyan" />
            </motion.section>

            <section className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
              <Card className="shadow-tactical">
                <CardHeader>
                  <div>
                    <CardTitle>Evolution operationnelle</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">Planification et completion mensuelles</p>
                  </div>
                </CardHeader>
                <CardContent className="h-80">
                  {chartsReady ? (
                    <MeasuredChart>
                      {({ width, height }) => (
                        <AreaChart width={width} height={height} data={dashboardData.operationsTrend}>
                          <defs>
                            <linearGradient id="planned" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.28} />
                              <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            dataKey="planned"
                            name="Planifiees"
                            stroke="#0f766e"
                            fill="url(#planned)"
                            strokeWidth={2}
                          />
                          <Area dataKey="completed" name="Terminees" stroke="#0e7490" fill="#0e749020" strokeWidth={2} />
                        </AreaChart>
                      )}
                    </MeasuredChart>
                  ) : (
                    <ChartSkeleton />
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-tactical">
                <CardHeader>
                  <CardTitle>Repartition par grade</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {chartsReady ? (
                    <MeasuredChart>
                      {({ width, height }) => (
                        <PieChart width={width} height={height}>
                          <Pie
                            data={dashboardData.personnelByGrade}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={64}
                            outerRadius={104}
                          >
                            {dashboardData.personnelByGrade.map((entry, index) => (
                              <Cell key={entry.name} fill={pieColors[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      )}
                    </MeasuredChart>
                  ) : (
                    <ChartSkeleton />
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Niveau de preparation des unites</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  {chartsReady ? (
                    <MeasuredChart>
                      {({ width, height }) => (
                      <BarChart width={width} height={height} data={dashboardData.unitReadiness}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="unit" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="readiness" name="Preparation" fill="#0f766e" radius={[6, 6, 0, 0]} />
                      </BarChart>
                      )}
                    </MeasuredChart>
                  ) : (
                    <ChartSkeleton />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Synthese intelligente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.alerts.map((alert) => (
                    <div key={alert.label} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-command-ink">{alert.level}</span>
                        <span className="rounded-sm bg-white px-2 py-1 text-xs text-primary">IA</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{alert.label}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function ChartSkeleton() {
  return <div className="h-full w-full animate-pulse rounded-md bg-slate-100" />;
}

function MeasuredChart({ children }: { children: (size: { width: number; height: number }) => ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      const height = Math.floor(entry.contentRect.height);
      if (width > 0 && height > 0) {
        setSize({ width, height });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full min-h-40 w-full min-w-0">
      {size.width > 0 && size.height > 0 ? children(size) : <ChartSkeleton />}
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
  tone = "primary"
}: {
  title: string;
  value: string | number;
  icon: ElementType;
  tone?: "primary" | "alert" | "cyan";
}) {
  const toneClass = {
    primary: "bg-teal-50 text-primary",
    alert: "bg-red-50 text-command-alert",
    cyan: "bg-cyan-50 text-command-cyan"
  }[tone];

  return (
    <Card className="min-h-32">
      <CardContent className="flex h-full flex-col justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-command-ink">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
