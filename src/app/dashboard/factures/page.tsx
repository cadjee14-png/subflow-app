"use client";

import { Receipt, TrendingDown, Clock, CheckCircle, AlertCircle, Download, Plus } from "lucide-react";
import { RippleButton } from "@/components/RippleButton";

/* ─── Accent ─────────────────────────────────────────── */
const A = "#10b981";
const AG = "linear-gradient(135deg,#10b981,#06b6d4)";
const AL = "rgba(16,185,129,0.12)";
const AS = "rgba(16,185,129,0.28)";

/* ─── Data ───────────────────────────────────────────── */
const factures = [
  { id: "FAC-2026-042", soustraitant: "Plomberie Durand & Fils",      prestation: "Remplacement canalisations",     montant: 8400,  emission: "2026-03-01", echeance: "2026-03-31", statut: "En attente" },
  { id: "FAC-2026-041", soustraitant: "Menuiserie Martin",             prestation: "Installation fenêtres PVC",      montant: 12600, emission: "2026-02-22", echeance: "2026-03-22", statut: "En retard"  },
  { id: "FAC-2026-040", soustraitant: "Peinture Leclerc",              prestation: "Peinture intérieure – Lot A",    montant: 5200,  emission: "2026-02-18", echeance: "2026-03-18", statut: "En retard"  },
  { id: "FAC-2026-039", soustraitant: "Charpente & Couverture Blanc",  prestation: "Charpente bâtiment B",           montant: 18900, emission: "2026-02-10", echeance: "2026-03-10", statut: "Payée"      },
  { id: "FAC-2026-038", soustraitant: "Carrelage Rousseau",            prestation: "Carrelage salle de bain",        montant: 4800,  emission: "2026-02-05", echeance: "2026-03-05", statut: "Payée"      },
  { id: "FAC-2026-037", soustraitant: "Électricité Moreau SARL",       prestation: "Tableau électrique – T3",        montant: 7200,  emission: "2026-01-28", echeance: "2026-02-28", statut: "Payée"      },
  { id: "FAC-2026-036", soustraitant: "Isolation Thermique Est",       prestation: "Isolation combles – Bâtiment A", montant: 9600,  emission: "2026-01-20", echeance: "2026-02-20", statut: "Payée"      },
  { id: "FAC-2026-035", soustraitant: "Climatisation Pro Sud",         prestation: "Pose climatisation bureaux",     montant: 14200, emission: "2026-01-15", echeance: "2026-02-15", statut: "En attente" },
  { id: "FAC-2026-034", soustraitant: "Sécurité Incendie Renard",      prestation: "Détection incendie – Zone C",    montant: 6400,  emission: "2026-01-10", echeance: "2026-02-10", statut: "Payée"      },
  { id: "FAC-2026-033", soustraitant: "Nettoyage Industriel Faure",    prestation: "Nettoyage fin de chantier",      montant: 2800,  emission: "2026-01-08", echeance: "2026-02-08", statut: "En attente" },
];

const statutCfg: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  "Payée":      { label: "Payée",       bg: "rgba(16,185,129,0.1)", text: "#059669", dot: "#10b981" },
  "En attente": { label: "En attente",  bg: "rgba(245,158,11,0.1)", text: "#d97706", dot: "#f59e0b" },
  "En retard":  { label: "En retard",   bg: "rgba(239,68,68,0.1)",  text: "#dc2626", dot: "#ef4444" },
};

const avatarGradients = [
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#3b82f6,#6366f1)",
];

function fmt(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); }
function isPast(d: string) { return new Date(d).getTime() < Date.now(); }

export default function FacturesPage() {
  const total = factures.reduce((s, f) => s + f.montant, 0);
  const attenteList = factures.filter((f) => f.statut === "En attente");
  const retardList  = factures.filter((f) => f.statut === "En retard");
  const payeeList   = factures.filter((f) => f.statut === "Payée");
  const attenteAmt  = attenteList.reduce((s, f) => s + f.montant, 0);
  const retardAmt   = retardList.reduce((s, f) => s + f.montant, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Factures</h1>
          <p className="text-sm text-slate-400 mt-0.5">{factures.length} factures · T1 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <RippleButton rippleVariant="violet" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <Download size={14} /> Exporter
          </RippleButton>
          <RippleButton rippleVariant="white" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: AG, boxShadow: `0 4px 14px ${AS}` }}>
            <Plus size={15} /> Nouvelle facture
          </RippleButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { label: "Montant total",    value: fmt(total),     sub: `${factures.length} factures`,      Icon: Receipt,      g: AG,              glow: AS              },
          { label: "En attente",       value: fmt(attenteAmt), sub: `${attenteList.length} factures`,  Icon: Clock,        g: "linear-gradient(135deg,#f59e0b,#f97316)", glow: "rgba(245,158,11,0.28)" },
          { label: "En retard",        value: fmt(retardAmt),  sub: `${retardList.length} factures`,   Icon: TrendingDown, g: "linear-gradient(135deg,#ef4444,#ec4899)", glow: "rgba(239,68,68,0.28)"  },
        ].map((k) => (
          <div key={k.label} className="shimmer-card card-lift rounded-2xl p-5 flex items-center gap-5"
            style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: k.g, boxShadow: `0 4px 14px ${k.glow}` }}>
              <k.Icon size={20} color="white" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{k.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{k.value}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-5 mb-5" style={{ border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-900">Répartition des statuts</p>
          <div className="flex items-center gap-4">
            {[["Payées", "#10b981", payeeList.length], ["En attente", "#f59e0b", attenteList.length], ["En retard", "#ef4444", retardList.length]].map(([l, c, n]) => (
              <span key={l as string} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full" style={{ background: c as string }} />{l as string} ({n as number})
              </span>
            ))}
          </div>
        </div>
        <div className="flex rounded-full overflow-hidden h-2 gap-0.5">
          <div style={{ width: `${(payeeList.length / factures.length) * 100}%`, background: "#10b981" }} className="rounded-l-full transition-all" />
          <div style={{ width: `${(attenteList.length / factures.length) * 100}%`, background: "#f59e0b" }} className="transition-all" />
          <div style={{ width: `${(retardList.length / factures.length) * 100}%`, background: "#ef4444" }} className="rounded-r-full transition-all" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(90deg,#f8fafc,#f0fdf4)", borderBottom: "1px solid #f1f5f9" }}>
              {["N° Facture", "Sous-traitant", "Prestation", "Montant HT", "Émission", "Échéance", "Statut", ""].map((c) => (
                <th key={c} className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {factures.map((f, idx) => {
              const s = statutCfg[f.statut];
              const past = isPast(f.echeance) && f.statut !== "Payée";
              return (
                <tr key={f.id} style={{ borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fff9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  className="transition-colors duration-100 cursor-pointer">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-black font-mono" style={{ color: A }}>{f.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                        style={{ background: avatarGradients[idx % avatarGradients.length] }}>
                        {f.soustraitant.split(/\s+/).map((w: string) => w[0]).slice(0,2).join("")}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">{f.soustraitant}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-xs text-slate-500 truncate max-w-[160px] block">{f.prestation}</span></td>
                  <td className="px-5 py-3.5"><span className="text-sm font-bold text-slate-900">{fmt(f.montant)}</span></td>
                  <td className="px-5 py-3.5"><span className="text-xs text-slate-500">{fmtDate(f.emission)}</span></td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold" style={{ color: past ? "#dc2626" : "#475569" }}>{fmtDate(f.echeance)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: s.bg, color: s.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />{s.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl hover:-translate-y-0.5 transition-all"
                      style={{ background: AL, color: A, border: `1px solid rgba(16,185,129,0.15)` }}>
                      Voir →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #f1f5f9", background: "#fafbff" }}>
          <p className="text-xs text-slate-400">{factures.length} factures affichées</p>
          <div className="flex items-center gap-1">
            {["←", "1", "2", "→"].map((p, i) => (
              <button key={i} className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                style={p === "1" ? { background: AG, color: "white", boxShadow: `0 2px 8px ${AS}` } : { color: "#94a3b8" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
