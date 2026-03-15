"use client";

import Link from "next/link";
import {
  Users,
  Receipt,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Info,
  Clock,
  FileBarChart2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RippleButton } from "@/components/RippleButton";

/* ─── Data ──────────────────────────────────────────── */

const kpis: Array<{
  title: string;
  value: string;
  sub: string;
  trend: string;
  trendUp: boolean | null;
  gradient: string;
  glow: string;
  Icon: LucideIcon;
  sparkline: number[];
  shimmerDelay: string;
}> = [
  {
    title: "Total sous-traitants",
    value: "34",
    sub: "+3 ce mois-ci",
    trend: "+8.8%",
    trendUp: true,
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    glow: "rgba(99,102,241,0.28)",
    Icon: Users,
    sparkline: [22, 25, 24, 28, 27, 31, 34],
    shimmerDelay: "0.2s",
  },
  {
    title: "Factures en attente",
    value: "12",
    sub: "67 800 €",
    trend: "+2",
    trendUp: false,
    gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
    glow: "rgba(245,158,11,0.22)",
    Icon: Receipt,
    sparkline: [8, 10, 7, 11, 9, 10, 12],
    shimmerDelay: "0.4s",
  },
  {
    title: "Alertes conformité",
    value: "5",
    sub: "3 critiques",
    trend: "-1",
    trendUp: true,
    gradient: "linear-gradient(135deg,#ef4444,#ec4899)",
    glow: "rgba(239,68,68,0.22)",
    Icon: AlertTriangle,
    sparkline: [3, 4, 6, 5, 7, 6, 5],
    shimmerDelay: "0.6s",
  },
  {
    title: "Budget mensuel",
    value: "128 400 €",
    sub: "82% consommé",
    trend: "82%",
    trendUp: null,
    gradient: "linear-gradient(135deg,#10b981,#06b6d4)",
    glow: "rgba(16,185,129,0.22)",
    Icon: TrendingUp,
    sparkline: [60, 65, 70, 68, 75, 78, 82],
    shimmerDelay: "0.8s",
  },
];

const recentActivity = [
  { action: "Kbis expiré",              entity: "Électricité Moreau SARL", time: "Il y a 2h",    type: "alert" },
  { action: "Facture validée",           entity: "Plomberie Durand & Fils", time: "Il y a 5h",    type: "success" },
  { action: "Nouveau contrat signé",     entity: "Menuiserie Martin",       time: "Hier",         type: "info" },
  { action: "Attestation URSSAF reçue", entity: "Peinture Leclerc",        time: "Hier",         type: "success" },
  { action: "Échéance dans 7 jours",    entity: "Isolation Thermique Est", time: "15 mars 2026", type: "warning" },
];

const activityConfig: Record<string, { dot: string; bg: string; text: string; label: string; Icon: LucideIcon }> = {
  alert:   { dot: "#ef4444", bg: "rgba(239,68,68,0.08)",  text: "#ef4444", label: "Alerte",        Icon: AlertTriangle },
  success: { dot: "#10b981", bg: "rgba(16,185,129,0.08)", text: "#10b981", label: "Succès",        Icon: CheckCircle   },
  info:    { dot: "#6366f1", bg: "rgba(99,102,241,0.08)", text: "#818cf8", label: "Info",          Icon: Info          },
  warning: { dot: "#f59e0b", bg: "rgba(245,158,11,0.08)", text: "#f59e0b", label: "Avertissement", Icon: Clock         },
};

const barData = [
  { month: "Oct", val: 72 },
  { month: "Nov", val: 85 },
  { month: "Déc", val: 91 },
  { month: "Jan", val: 78 },
  { month: "Fév", val: 88 },
  { month: "Mar", val: 82 },
];

const conformiteData = [
  { label: "Conformes",     val: 26, color: "#10b981" },
  { label: "En attente",    val:  6, color: "#f59e0b" },
  { label: "Non conformes", val:  2, color: "#ef4444" },
];
const total = conformiteData.reduce((s, d) => s + d.val, 0);

/* ─── Sparkline SVG ──────────────────────────────────── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 72, h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible opacity-70">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────── */
export default function DashboardPage() {
  const maxBar = Math.max(...barData.map((d) => d.val));

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-0.5">Mars 2026 · ACME BTP SAS</p>
        </div>
        <div className="flex items-center gap-2">
          <RippleButton
            rippleVariant="violet"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            Exporter
          </RippleButton>
          <RippleButton
            rippleVariant="white"
            className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-2"
          >
            <FileBarChart2 size={15} />
            Nouveau rapport
          </RippleButton>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="shimmer-card card-lift rounded-2xl p-5 flex flex-col gap-4"
            style={{
              background: "white",
              border: "1px solid #f1f5f9",
              boxShadow: `0 2px 12px rgba(0,0,0,0.04)`,
              ["--shimmer-delay" as string]: kpi.shimmerDelay,
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
                style={{ background: kpi.gradient, boxShadow: `0 4px 14px ${kpi.glow}` }}
              >
                <kpi.Icon size={20} color="white" strokeWidth={2.2} />
              </div>
              <Sparkline
                values={kpi.sparkline}
                color={kpi.glow.replace(/[\d.]+\)$/, "0.9)")}
              />
            </div>

            {/* Value */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{kpi.title}</p>
              <p className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight">{kpi.value}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #f1f5f9" }}>
              <span className="text-xs text-slate-400">{kpi.sub}</span>
              {kpi.trendUp !== null ? (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: kpi.trendUp ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                    color: kpi.trendUp ? "#10b981" : "#ef4444",
                  }}
                >
                  {kpi.trendUp ? "↑" : "↓"} {kpi.trend}
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                  {kpi.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom grid ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Activity feed */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-slate-900 text-lg">Activité récente</h2>
              <p className="text-xs text-slate-400 mt-0.5">Dernières actions enregistrées</p>
            </div>
            <Link
              href="/dashboard/sous-traitants"
              className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5"
              style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.15)" }}
            >
              Voir tout →
            </Link>
          </div>

          <div className="space-y-1.5">
            {recentActivity.map((item, i) => {
              const cfg = activityConfig[item.type];
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.bg }}
                  >
                    <cfg.Icon size={14} style={{ color: cfg.dot }} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{item.action}</p>
                    <p className="text-xs text-slate-400 truncate">{item.entity}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.text }}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Conformité donut */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            <h3 className="font-black text-slate-900 mb-4">Conformité globale</h3>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="36" cy="36" r="28" fill="none" stroke="#10b981" strokeWidth="8"
                    strokeDasharray={`${(26 / total) * 175.9} 175.9`}
                    strokeDashoffset="43.98"
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-slate-900">76%</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {conformiteData.map((d) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs text-slate-500">{d.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div
            className="rounded-2xl p-5 flex-1"
            style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900">Budget consommé</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">%</span>
            </div>
            <div className="flex items-end gap-2" style={{ height: 72 }}>
              {barData.map((b) => (
                <div key={b.month} className="flex-1 flex flex-col items-center gap-1" style={{ height: "100%" }}>
                  <div className="w-full flex items-end" style={{ flex: 1 }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${(b.val / maxBar) * 100}%`,
                        background:
                          b.month === "Mar"
                            ? "linear-gradient(180deg,#6366f1,#8b5cf6)"
                            : "linear-gradient(180deg,#c7d2fe,#e0e7ff)",
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400">{b.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical alerts */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(236,72,153,0.04))",
              border: "1px solid rgba(239,68,68,0.12)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-slate-900">Alertes critiques</h3>
              <span
                className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)" }}
              >
                3
              </span>
            </div>
            <div className="space-y-2">
              {[
                { name: "Électricité Moreau", issue: "Kbis expiré" },
                { name: "Travaux Genet SA",   issue: "Assurance expirée" },
                { name: "Isolation Est",       issue: "URSSAF manquant" },
              ].map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.06)" }}
                >
                  <AlertTriangle size={13} style={{ color: "#ef4444", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{a.name}</p>
                    <p className="text-[11px]" style={{ color: "#ef4444" }}>{a.issue}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/sous-traitants"
              className="mt-3 block text-center text-xs font-bold py-2 rounded-xl transition-all duration-150"
              style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
            >
              Gérer les non-conformités
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
