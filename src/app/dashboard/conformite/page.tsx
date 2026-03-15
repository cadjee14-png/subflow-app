"use client";

import { ShieldCheck, AlertTriangle, XCircle, FileText, RefreshCw, Plus, Download } from "lucide-react";
import { RippleButton } from "@/components/RippleButton";

/* ─── Accent ─────────────────────────────────────────── */
const A = "#ef4444";
const AG = "linear-gradient(135deg,#ef4444,#ec4899)";
const AL = "rgba(239,68,68,0.10)";
const AS = "rgba(239,68,68,0.28)";

/* ─── Data ───────────────────────────────────────────── */
type DocStatus = "Valide" | "Expirant" | "Expiré" | "Manquant";

interface Document {
  type: string;
  expiry: string | null;
  statut: DocStatus;
}

interface Soustraitant {
  nom: string;
  score: number;
  docs: Document[];
}

const soustraitants: Soustraitant[] = [
  {
    nom: "Plomberie Durand & Fils",
    score: 100,
    docs: [
      { type: "Kbis",            expiry: "2027-03-01", statut: "Valide"   },
      { type: "Assurance RC Pro", expiry: "2026-12-31", statut: "Valide"   },
      { type: "Attestation URSSAF", expiry: "2026-06-30", statut: "Valide" },
    ],
  },
  {
    nom: "Menuiserie Martin",
    score: 67,
    docs: [
      { type: "Kbis",            expiry: "2026-04-10", statut: "Expirant"  },
      { type: "Assurance RC Pro", expiry: "2026-11-30", statut: "Valide"   },
      { type: "Attestation URSSAF", expiry: "2025-12-31", statut: "Expiré" },
    ],
  },
  {
    nom: "Peinture Leclerc",
    score: 100,
    docs: [
      { type: "Kbis",            expiry: "2027-01-20", statut: "Valide"   },
      { type: "Assurance RC Pro", expiry: "2026-09-30", statut: "Valide"   },
      { type: "Attestation URSSAF", expiry: "2026-09-30", statut: "Valide" },
    ],
  },
  {
    nom: "Électricité Moreau SARL",
    score: 33,
    docs: [
      { type: "Kbis",            expiry: "2026-03-20", statut: "Expirant"  },
      { type: "Assurance RC Pro", expiry: "2025-11-30", statut: "Expiré"   },
      { type: "Attestation URSSAF", expiry: null,        statut: "Manquant" },
    ],
  },
  {
    nom: "Isolation Thermique Est",
    score: 67,
    docs: [
      { type: "Kbis",            expiry: "2026-10-15", statut: "Valide"   },
      { type: "Assurance RC Pro", expiry: "2026-03-25", statut: "Expirant" },
      { type: "Attestation URSSAF", expiry: "2026-09-30", statut: "Valide" },
    ],
  },
  {
    nom: "Charpente & Couverture Blanc",
    score: 100,
    docs: [
      { type: "Kbis",            expiry: "2027-05-01", statut: "Valide"   },
      { type: "Assurance RC Pro", expiry: "2026-12-31", statut: "Valide"   },
      { type: "Attestation URSSAF", expiry: "2026-09-30", statut: "Valide" },
    ],
  },
  {
    nom: "Climatisation Pro Sud",
    score: 33,
    docs: [
      { type: "Kbis",            expiry: "2025-12-01", statut: "Expiré"   },
      { type: "Assurance RC Pro", expiry: "2026-08-31", statut: "Valide"   },
      { type: "Attestation URSSAF", expiry: null,        statut: "Manquant" },
    ],
  },
  {
    nom: "Sécurité Incendie Renard",
    score: 67,
    docs: [
      { type: "Kbis",            expiry: "2026-07-01", statut: "Valide"   },
      { type: "Assurance RC Pro", expiry: "2026-03-20", statut: "Expirant" },
      { type: "Attestation URSSAF", expiry: "2026-09-30", statut: "Valide" },
    ],
  },
];

const docCfg: Record<DocStatus, { label: string; bg: string; text: string; dot: string }> = {
  "Valide":   { label: "Valide",    bg: "rgba(16,185,129,0.10)",  text: "#059669", dot: "#10b981" },
  "Expirant": { label: "Expirant",  bg: "rgba(245,158,11,0.10)",  text: "#d97706", dot: "#f59e0b" },
  "Expiré":   { label: "Expiré",    bg: "rgba(239,68,68,0.10)",   text: "#dc2626", dot: "#ef4444" },
  "Manquant": { label: "Manquant",  bg: "rgba(100,116,139,0.10)", text: "#64748b", dot: "#94a3b8" },
};

const avatarGradients = [
  "linear-gradient(135deg,#ef4444,#ec4899)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#8b5cf6,#6366f1)",
  "linear-gradient(135deg,#f59e0b,#f97316)",
  "linear-gradient(135deg,#3b82f6,#06b6d4)",
];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

/* Score arc (SVG) */
function ScoreArc({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ * 0.75;
  const color = score === 100 ? "#10b981" : score >= 66 ? "#f59e0b" : "#ef4444";
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10"
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
        strokeDashoffset={circ * 0.125}
        strokeLinecap="round" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.125}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x="70" y="68" textAnchor="middle" dominantBaseline="middle"
        fontSize="22" fontWeight="900" fill={color}>{score}%</text>
      <text x="70" y="86" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">Score</text>
    </svg>
  );
}

export default function ConformitePage() {
  const allDocs = soustraitants.flatMap((s) => s.docs);
  const valides  = allDocs.filter((d) => d.statut === "Valide").length;
  const expirant = allDocs.filter((d) => d.statut === "Expirant").length;
  const expires  = allDocs.filter((d) => d.statut === "Expiré").length;
  const manquant = allDocs.filter((d) => d.statut === "Manquant").length;
  const globalScore = Math.round((valides / allDocs.length) * 100);

  const urgentSTs = soustraitants.filter((s) =>
    s.docs.some((d) => d.statut === "Expiré" || d.statut === "Manquant")
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Conformité</h1>
          <p className="text-sm text-slate-400 mt-0.5">{soustraitants.length} sous-traitants surveillés</p>
        </div>
        <div className="flex items-center gap-2">
          <RippleButton rippleVariant="violet"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all"
            style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <Download size={14} /> Exporter
          </RippleButton>
          <RippleButton rippleVariant="white"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
            style={{ background: AG, boxShadow: `0 4px 14px ${AS}` }}>
            <RefreshCw size={15} /> Actualiser
          </RippleButton>
        </div>
      </div>

      {/* Top row: Score global + KPI cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* Score global */}
        <div className="shimmer-card card-lift rounded-2xl p-5 flex flex-col items-center justify-center col-span-1"
          style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <ScoreArc score={globalScore} />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">Conformité globale</p>
        </div>

        {/* 3 KPI cards */}
        <div className="col-span-3 grid grid-cols-3 gap-5">
          {[
            { label: "Documents valides",   value: valides,  sub: `sur ${allDocs.length} docs`, Icon: ShieldCheck,    g: "linear-gradient(135deg,#10b981,#06b6d4)", glow: "rgba(16,185,129,0.28)"  },
            { label: "Expirant bientôt",    value: expirant, sub: "Dans < 30 jours",            Icon: AlertTriangle,  g: "linear-gradient(135deg,#f59e0b,#f97316)", glow: "rgba(245,158,11,0.28)"  },
            { label: "Non conformes",       value: expires + manquant, sub: `${expires} expirés · ${manquant} manquants`, Icon: XCircle, g: AG, glow: AS },
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
      </div>

      {/* Alert banner */}
      {urgentSTs.length > 0 && (
        <div className="rounded-2xl p-4 mb-5 flex items-start gap-3"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
          <XCircle size={18} style={{ color: A, flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "#991b1b" }}>
              {urgentSTs.length} sous-traitant(s) avec des documents expirés ou manquants
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#b91c1c" }}>
              {urgentSTs.map((s) => s.nom).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Document grid per subcontractor */}
      <div className="grid grid-cols-1 gap-4">
        {soustraitants.map((st, idx) => {
          const hasIssue = st.docs.some((d) => d.statut === "Expiré" || d.statut === "Manquant");
          const scoreColor = st.score === 100 ? "#10b981" : st.score >= 66 ? "#d97706" : "#dc2626";
          const scoreBg = st.score === 100 ? "rgba(16,185,129,0.08)" : st.score >= 66 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)";

          return (
            <div key={st.nom} className="rounded-2xl overflow-hidden"
              style={{ background: "white", border: `1px solid ${hasIssue ? "rgba(239,68,68,0.18)" : "#f1f5f9"}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              {/* ST header */}
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid #f8fafc", background: hasIssue ? "rgba(239,68,68,0.02)" : "#fafbff" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                    style={{ background: avatarGradients[idx % avatarGradients.length] }}>
                    {st.nom.split(/\s+/).map((w: string) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{st.nom}</p>
                    <p className="text-xs text-slate-400">{st.docs.length} documents</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
                    style={{ background: scoreBg, color: scoreColor }}>
                    <ShieldCheck size={12} />
                    {st.score}%
                  </div>
                  <button className="text-xs font-bold px-3 py-1.5 rounded-xl hover:-translate-y-0.5 transition-all"
                    style={{ background: AL, color: A, border: "1px solid rgba(239,68,68,0.18)" }}>
                    Voir →
                  </button>
                </div>
              </div>

              {/* Documents row */}
              <div className="grid grid-cols-3 divide-x divide-slate-50">
                {st.docs.map((doc) => {
                  const cfg = docCfg[doc.statut];
                  const days = doc.expiry ? daysUntil(doc.expiry) : null;
                  return (
                    <div key={doc.type} className="px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={14} color="#94a3b8" />
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{doc.type}</p>
                          {doc.expiry
                            ? <p className="text-[10px] text-slate-400">{fmtDate(doc.expiry)}{days !== null && days < 30 && days > 0 && <span className="ml-1 font-bold text-amber-500">J-{days}</span>}</p>
                            : <p className="text-[10px] text-slate-400 italic">Non fourni</p>
                          }
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add document CTA */}
      <div className="mt-5 rounded-2xl p-5 flex items-center justify-between"
        style={{ background: "rgba(239,68,68,0.04)", border: "1px dashed rgba(239,68,68,0.25)" }}>
        <div>
          <p className="text-sm font-bold text-slate-700">Ajouter un document manquant</p>
          <p className="text-xs text-slate-400 mt-0.5">Téléchargez les documents requis pour les sous-traitants non conformes</p>
        </div>
        <RippleButton rippleVariant="white"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
          style={{ background: AG, boxShadow: `0 4px 14px ${AS}` }}>
          <Plus size={14} /> Ajouter un document
        </RippleButton>
      </div>
    </div>
  );
}
