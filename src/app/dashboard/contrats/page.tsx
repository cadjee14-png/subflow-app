"use client";

import { FileCheck2, AlertTriangle, Clock, PenLine, RefreshCw, Plus, Download } from "lucide-react";
import { RippleButton } from "@/components/RippleButton";

/* ─── Accent ─────────────────────────────────────────── */
const A = "#f59e0b";
const AG = "linear-gradient(135deg,#f59e0b,#f97316)";
const AL = "rgba(245,158,11,0.12)";
const AS = "rgba(245,158,11,0.28)";

/* ─── Data ───────────────────────────────────────────── */
const contrats = [
  { ref: "CTR-2026-012", soustraitant: "Plomberie Durand & Fils",     objet: "Travaux plomberie – Résidence Les Cèdres",     debut: "2026-01-01", fin: "2026-12-31", valeur: 85000, signe: true,  statut: "Actif"                },
  { ref: "CTR-2026-011", soustraitant: "Menuiserie Martin",            objet: "Fourniture et pose menuiseries – Lot 4",       debut: "2026-02-01", fin: "2026-07-31", valeur: 62000, signe: true,  statut: "Actif"                },
  { ref: "CTR-2026-010", soustraitant: "Peinture Leclerc",             objet: "Peinture intérieure – Programme Horizon",      debut: "2026-03-01", fin: "2026-05-31", valeur: 28000, signe: true,  statut: "Actif"                },
  { ref: "CTR-2026-009", soustraitant: "Électricité Moreau SARL",      objet: "Installation électrique – Bâtiment C",         debut: "2026-01-15", fin: "2026-04-30", valeur: 45000, signe: false, statut: "En cours de signature" },
  { ref: "CTR-2026-008", soustraitant: "Isolation Thermique Est",      objet: "Isolation thermique – 3 bâtiments",            debut: "2025-06-01", fin: "2026-03-31", valeur: 95000, signe: true,  statut: "Expirant"             },
  { ref: "CTR-2026-007", soustraitant: "Charpente & Couverture Blanc", objet: "Charpente bois – Villa Panorama",              debut: "2025-09-01", fin: "2026-06-30", valeur: 120000, signe: true, statut: "Actif"                },
  { ref: "CTR-2026-006", soustraitant: "Climatisation Pro Sud",        objet: "Climatisation – Immeuble Tertiaire",           debut: "2026-02-15", fin: "2026-04-15", valeur: 38000, signe: false, statut: "En cours de signature" },
  { ref: "CTR-2026-005", soustraitant: "Sécurité Incendie Renard",     objet: "Sécurité incendie annuelle – 4 sites",         debut: "2026-01-01", fin: "2026-03-25", valeur: 24000, signe: true,  statut: "Expirant"             },
  { ref: "CTR-2026-004", soustraitant: "Carrelage Rousseau",           objet: "Carrelage – Résidence Les Oliviers",           debut: "2025-11-01", fin: "2026-04-30", valeur: 31000, signe: true,  statut: "Actif"                },
  { ref: "CTR-2026-003", soustraitant: "Nettoyage Industriel Faure",   objet: "Nettoyage chantier mensuel – 6 sites",         debut: "2026-01-01", fin: "2026-12-31", valeur: 18000, signe: true,  statut: "Actif"                },
];

const statutCfg: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  "Actif":                  { label: "Actif",                   bg: "rgba(16,185,129,0.1)",  text: "#059669", dot: "#10b981" },
  "En cours de signature":  { label: "En cours de signature",   bg: "rgba(99,102,241,0.1)",  text: "#4338ca", dot: "#6366f1" },
  "Expirant":               { label: "Expirant bientôt",        bg: "rgba(245,158,11,0.1)",  text: "#d97706", dot: "#f59e0b" },
  "Expiré":                 { label: "Expiré",                  bg: "rgba(239,68,68,0.1)",   text: "#dc2626", dot: "#ef4444" },
};

const avatarGradients = [
  "linear-gradient(135deg,#f59e0b,#f97316)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#8b5cf6,#6366f1)",
  "linear-gradient(135deg,#3b82f6,#06b6d4)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
];

function fmt(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); }
function daysUntil(d: string) {
  const diff = new Date(d).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export default function ContratsPage() {
  const actifs  = contrats.filter((c) => c.statut === "Actif");
  const signing = contrats.filter((c) => c.statut === "En cours de signature");
  const expiring = contrats.filter((c) => c.statut === "Expirant");
  const totalValeur = contrats.filter((c) => c.statut === "Actif" || c.statut === "Expirant").reduce((s, c) => s + c.valeur, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Contrats</h1>
          <p className="text-sm text-slate-400 mt-0.5">{contrats.length} contrats enregistrés</p>
        </div>
        <div className="flex items-center gap-2">
          <RippleButton rippleVariant="violet" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all"
            style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <Download size={14} /> Exporter
          </RippleButton>
          <RippleButton rippleVariant="white" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
            style={{ background: AG, boxShadow: `0 4px 14px ${AS}` }}>
            <Plus size={15} /> Nouveau contrat
          </RippleButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {[
          { label: "Contrats actifs",           value: String(actifs.length),    sub: "En cours",             Icon: FileCheck2, g: AG,                                              glow: AS },
          { label: "En cours de signature",     value: String(signing.length),   sub: "Signature requise",    Icon: PenLine,   g: "linear-gradient(135deg,#6366f1,#8b5cf6)",        glow: "rgba(99,102,241,0.28)" },
          { label: "Renouvellements à venir",   value: String(expiring.length),  sub: "Dans < 30 jours",      Icon: RefreshCw, g: "linear-gradient(135deg,#ef4444,#f59e0b)",        glow: "rgba(239,68,68,0.28)" },
          { label: "Valeur engagée",            value: fmt(totalValeur),         sub: "Contrats actifs",      Icon: Clock,     g: "linear-gradient(135deg,#10b981,#06b6d4)",        glow: "rgba(16,185,129,0.28)" },
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

      {/* Alerts banner */}
      {expiring.length > 0 && (
        <div className="rounded-2xl p-4 mb-5 flex items-start gap-3"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <AlertTriangle size={18} style={{ color: A, flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "#92400e" }}>
              {expiring.length} contrat(s) arrivent à échéance dans moins de 30 jours
            </p>
            <p className="text-xs text-amber-700/70 mt-0.5">
              {expiring.map((c) => c.soustraitant).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(90deg,#f8fafc,#fffbeb)", borderBottom: "1px solid #f1f5f9" }}>
              {["Référence", "Sous-traitant", "Objet", "Début", "Fin", "Valeur", "Statut", "Signé", ""].map((c) => (
                <th key={c} className="text-left px-4 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contrats.map((c, idx) => {
              const s = statutCfg[c.statut];
              const days = daysUntil(c.fin);
              const urgentRow = c.statut === "Expirant";
              return (
                <tr key={c.ref} style={{ borderBottom: "1px solid #f8fafc", background: urgentRow ? "rgba(245,158,11,0.02)" : "" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = urgentRow ? "rgba(245,158,11,0.05)" : "#fafbff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = urgentRow ? "rgba(245,158,11,0.02)" : "")}
                  className="transition-colors duration-100 cursor-pointer">
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-black font-mono" style={{ color: A }}>{c.ref}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                        style={{ background: avatarGradients[idx % avatarGradients.length] }}>
                        {c.soustraitant.split(/\s+/).map((w: string) => w[0]).slice(0,2).join("")}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">{c.soustraitant}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-xs text-slate-500 truncate max-w-[180px] block">{c.objet}</span></td>
                  <td className="px-4 py-3.5"><span className="text-xs text-slate-500">{fmtDate(c.debut)}</span></td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold" style={{ color: days < 30 ? "#d97706" : "#475569" }}>{fmtDate(c.fin)}</span>
                      {days < 30 && days > 0 && <span className="text-[10px] font-bold" style={{ color: "#f59e0b" }}>J-{days}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-sm font-bold text-slate-900">{fmt(c.valeur)}</span></td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: s.bg, color: s.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />{s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: c.signe ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: c.signe ? "#059669" : "#dc2626" }}>
                      {c.signe ? "✓ Signé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="text-xs font-bold px-3 py-1.5 rounded-xl hover:-translate-y-0.5 transition-all"
                      style={{ background: AL, color: A, border: `1px solid rgba(245,158,11,0.18)` }}>
                      Voir →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #f1f5f9", background: "#fafbff" }}>
          <p className="text-xs text-slate-400">{contrats.length} contrats affichés</p>
          <div className="flex gap-1">
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
