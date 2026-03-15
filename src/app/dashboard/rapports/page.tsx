"use client";

import { BarChart2, TrendingUp, FileText, Download, Calendar, Users } from "lucide-react";
import { RippleButton } from "@/components/RippleButton";

/* ─── Accent ─────────────────────────────────────────── */
const A = "#06b6d4";
const AG = "linear-gradient(135deg,#06b6d4,#3b82f6)";
const AL = "rgba(6,182,212,0.10)";
const AS = "rgba(6,182,212,0.28)";

/* ─── Data ───────────────────────────────────────────── */
const budgetMensuel = [
  { mois: "Oct",  val: 68000  },
  { mois: "Nov",  val: 82000  },
  { mois: "Déc",  val: 54000  },
  { mois: "Jan",  val: 91000  },
  { mois: "Fév",  val: 103000 },
  { mois: "Mar",  val: 88000  },
];

const repartitionTypes = [
  { type: "Gros œuvre",        val: 38, color: "#6366f1" },
  { type: "Second œuvre",      val: 27, color: "#06b6d4" },
  { type: "Fluides",           val: 18, color: "#10b981" },
  { type: "Finitions",         val: 11, color: "#f59e0b" },
  { type: "Autres",            val:  6, color: "#ec4899" },
];

const conformiteEvol = [
  { mois: "Oct", score: 58 },
  { mois: "Nov", score: 63 },
  { mois: "Déc", score: 61 },
  { mois: "Jan", score: 69 },
  { mois: "Fév", score: 72 },
  { mois: "Mar", score: 76 },
];

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

/* Bar chart */
function BudgetChart() {
  const max = Math.max(...budgetMensuel.map((b) => b.val));
  return (
    <div className="flex items-end justify-between gap-3 h-44 pt-4">
      {budgetMensuel.map((b, i) => {
        const pct = (b.val / max) * 100;
        const isCurrent = i === budgetMensuel.length - 1;
        return (
          <div key={b.mois} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold" style={{ color: isCurrent ? A : "#94a3b8" }}>{fmt(b.val)}</span>
            <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: `${pct}%`, background: isCurrent ? AG : "linear-gradient(180deg,#e2e8f0,#f1f5f9)", boxShadow: isCurrent ? `0 4px 14px ${AS}` : "none", minHeight: 8 }}>
              {isCurrent && (
                <div className="absolute inset-0 opacity-30"
                  style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.4) 0%,transparent 100%)" }} />
              )}
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{b.mois}</span>
          </div>
        );
      })}
    </div>
  );
}

/* Conformity sparkline */
function ConformiteChart() {
  const w = 420;
  const h = 100;
  const pad = 16;
  const xs = conformiteEvol.map((_, i) => pad + (i / (conformiteEvol.length - 1)) * (w - pad * 2));
  const ys = conformiteEvol.map((d) => h - pad - ((d.score - 50) / 30) * (h - pad * 2));
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const area = `M${xs[0]},${ys[0]} ` + xs.slice(1).map((x, i) => `L${x},${ys[i + 1]}`).join(" ") + ` L${xs[xs.length - 1]},${h} L${xs[0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: 100 }}>
      <defs>
        <linearGradient id="conf-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#conf-grad)" />
      <polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={i === xs.length - 1 ? 5 : 3}
          fill={i === xs.length - 1 ? A : "white"} stroke={A} strokeWidth="2" />
      ))}
      {conformiteEvol.map((d, i) => (
        <text key={i} x={xs[i]} y={h - 2} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">{d.mois}</text>
      ))}
    </svg>
  );
}

export default function RapportsPage() {
  const totalBudget = budgetMensuel.reduce((s, b) => s + b.val, 0);
  const avgBudget = Math.round(totalBudget / budgetMensuel.length);
  const currentScore = conformiteEvol[conformiteEvol.length - 1].score;
  const prevScore = conformiteEvol[conformiteEvol.length - 2].score;
  const scoreDelta = currentScore - prevScore;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rapports</h1>
          <p className="text-sm text-slate-400 mt-0.5">Analyse · T4 2025 – T1 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <RippleButton rippleVariant="violet"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all"
            style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <Download size={14} /> Exporter PDF
          </RippleButton>
          <RippleButton rippleVariant="white"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
            style={{ background: AG, boxShadow: `0 4px 14px ${AS}` }}>
            <FileText size={15} /> Générer rapport
          </RippleButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {[
          { label: "Budget total (6 mois)", value: fmt(totalBudget),      sub: "Oct 2025 – Mar 2026",       Icon: BarChart2,  g: AG,                                              glow: AS                        },
          { label: "Budget mensuel moyen",  value: fmt(avgBudget),        sub: "Par mois sur 6 mois",       Icon: Calendar,  g: "linear-gradient(135deg,#6366f1,#8b5cf6)",        glow: "rgba(99,102,241,0.28)"   },
          { label: "Score conformité",      value: `${currentScore}%`,    sub: `${scoreDelta > 0 ? "+" : ""}${scoreDelta}% vs mois dernier`, Icon: TrendingUp, g: "linear-gradient(135deg,#10b981,#06b6d4)", glow: "rgba(16,185,129,0.28)" },
          { label: "Sous-traitants actifs", value: "8",                   sub: "Sur 10 enregistrés",        Icon: Users,     g: "linear-gradient(135deg,#f59e0b,#f97316)",        glow: "rgba(245,158,11,0.28)"   },
        ].map((k) => (
          <div key={k.label} className="shimmer-card card-lift rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide leading-tight">{k.label}</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: k.g, boxShadow: `0 4px 12px ${k.glow}` }}>
                <k.Icon size={16} color="white" strokeWidth={2.2} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{k.value}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Budget mensuel (2/3 width) */}
        <div className="col-span-2 rounded-2xl p-5"
          style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-slate-900">Budget mensuel sous-traitance</p>
            <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: AL, color: A }}>6 derniers mois</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">En euros HT · barres comparatives</p>
          <BudgetChart />
        </div>

        {/* Répartition par type */}
        <div className="rounded-2xl p-5"
          style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <p className="text-sm font-bold text-slate-900 mb-1">Répartition par type</p>
          <p className="text-xs text-slate-400 mb-4">% du volume total engagé</p>
          <div className="flex flex-col gap-3">
            {repartitionTypes.map((r) => (
              <div key={r.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">{r.type}</span>
                  <span className="text-xs font-black" style={{ color: r.color }}>{r.val}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${r.val}%`, background: r.color, boxShadow: `0 0 6px ${r.color}60` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conformity evolution */}
      <div className="rounded-2xl p-5 mb-5"
        style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Évolution de la conformité</p>
            <p className="text-xs text-slate-400">Score global mensuel · documents valides / total</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black" style={{ color: A }}>{currentScore}%</span>
            <span className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ background: scoreDelta >= 0 ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)", color: scoreDelta >= 0 ? "#059669" : "#dc2626" }}>
              {scoreDelta >= 0 ? "+" : ""}{scoreDelta}%
            </span>
          </div>
        </div>
        <ConformiteChart />
      </div>

      {/* Recent reports list */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9", background: "linear-gradient(90deg,#f8fafc,#ecfeff)" }}>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Rapports récents</p>
        </div>
        {[
          { name: "Rapport conformité – Février 2026", date: "28 fév. 2026", type: "Conformité",    size: "1.2 MB", color: "#ef4444" },
          { name: "Bilan sous-traitance – T4 2025",    date: "15 jan. 2026", type: "Financier",     size: "2.4 MB", color: "#6366f1" },
          { name: "Rapport conformité – Janvier 2026", date: "31 jan. 2026", type: "Conformité",    size: "1.1 MB", color: "#ef4444" },
          { name: "Analyse prestataires – Déc. 2025",  date: "31 déc. 2025", type: "Analytique",    size: "3.1 MB", color: A       },
          { name: "Rapport conformité – Déc. 2025",    date: "31 déc. 2025", type: "Conformité",    size: "0.9 MB", color: "#ef4444" },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5 transition-colors duration-100 cursor-pointer"
            style={{ borderBottom: i < 4 ? "1px solid #f8fafc" : "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fffe")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${r.color}18` }}>
                <FileText size={14} style={{ color: r.color }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">{r.name}</p>
                <p className="text-[10px] text-slate-400">{r.date} · {r.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${r.color}15`, color: r.color }}>{r.type}</span>
              <button className="text-xs font-bold px-3 py-1.5 rounded-xl hover:-translate-y-0.5 transition-all"
                style={{ background: AL, color: A, border: "1px solid rgba(6,182,212,0.18)" }}>
                <Download size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
