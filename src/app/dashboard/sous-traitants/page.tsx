"use client";

import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  ArrowRight,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RippleButton } from "@/components/RippleButton";

/* ─── Data ──────────────────────────────────────────── */

const soustraitants = [
  { nom: "Électricité Moreau SARL",     specialite: "Électricité",       statut: "Non conforme", prochaine_echeance: "2026-03-10", factures_en_attente: 2 },
  { nom: "Plomberie Durand & Fils",      specialite: "Plomberie",         statut: "Conforme",     prochaine_echeance: "2026-06-30", factures_en_attente: 0 },
  { nom: "Menuiserie Martin",            specialite: "Menuiserie",        statut: "Conforme",     prochaine_echeance: "2026-09-15", factures_en_attente: 1 },
  { nom: "Peinture Leclerc",             specialite: "Peinture",          statut: "Conforme",     prochaine_echeance: "2026-05-01", factures_en_attente: 3 },
  { nom: "Isolation Thermique Est",      specialite: "Isolation",         statut: "En attente",   prochaine_echeance: "2026-03-22", factures_en_attente: 1 },
  { nom: "Travaux Genet SA",             specialite: "Gros œuvre",        statut: "Non conforme", prochaine_echeance: "2026-03-14", factures_en_attente: 0 },
  { nom: "Charpente & Couverture Blanc", specialite: "Charpente",         statut: "Conforme",     prochaine_echeance: "2026-11-20", factures_en_attente: 2 },
  { nom: "Carrelage Rousseau",           specialite: "Carrelage",         statut: "Conforme",     prochaine_echeance: "2026-07-10", factures_en_attente: 0 },
  { nom: "Climatisation Pro Sud",        specialite: "CVC",               statut: "En attente",   prochaine_echeance: "2026-04-05", factures_en_attente: 1 },
  { nom: "Sécurité Incendie Renard",     specialite: "Sécurité incendie", statut: "Conforme",     prochaine_echeance: "2026-08-18", factures_en_attente: 0 },
  { nom: "Espaces Verts Lambert",        specialite: "Paysagisme",        statut: "Conforme",     prochaine_echeance: "2026-10-01", factures_en_attente: 1 },
  { nom: "Nettoyage Industriel Faure",   specialite: "Nettoyage",         statut: "En attente",   prochaine_echeance: "2026-03-28", factures_en_attente: 2 },
];

const statutCfg: Record<string, { label: string; bg: string; text: string; dot: string; glow: string }> = {
  Conforme:       { label: "Conforme",       bg: "rgba(16,185,129,0.1)", text: "#059669", dot: "#10b981", glow: "rgba(16,185,129,0.45)" },
  "En attente":   { label: "En attente",     bg: "rgba(245,158,11,0.1)", text: "#d97706", dot: "#f59e0b", glow: "rgba(245,158,11,0.45)" },
  "Non conforme": { label: "Non conforme",   bg: "rgba(239,68,68,0.1)",  text: "#dc2626", dot: "#ef4444", glow: "rgba(239,68,68,0.45)"  },
};

const specialiteCfg: Record<string, { bg: string; text: string }> = {
  "Électricité":       { bg: "rgba(245,158,11,0.1)",  text: "#d97706" },
  "Plomberie":         { bg: "rgba(6,182,212,0.1)",   text: "#0891b2" },
  "Menuiserie":        { bg: "rgba(139,92,246,0.1)",  text: "#7c3aed" },
  "Peinture":          { bg: "rgba(236,72,153,0.1)",  text: "#be185d" },
  "Isolation":         { bg: "rgba(16,185,129,0.1)",  text: "#059669" },
  "Gros œuvre":        { bg: "rgba(107,114,128,0.1)", text: "#4b5563" },
  "Charpente":         { bg: "rgba(180,83,9,0.1)",    text: "#92400e" },
  "Carrelage":         { bg: "rgba(99,102,241,0.1)",  text: "#4338ca" },
  "CVC":               { bg: "rgba(14,165,233,0.1)",  text: "#0369a1" },
  "Sécurité incendie": { bg: "rgba(239,68,68,0.1)",   text: "#b91c1c" },
  "Paysagisme":        { bg: "rgba(34,197,94,0.1)",   text: "#15803d" },
  "Nettoyage":         { bg: "rgba(168,85,247,0.1)",  text: "#7e22ce" },
};

const avatarGradients = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#3b82f6,#6366f1)",
  "linear-gradient(135deg,#f97316,#ec4899)",
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function isUrgent(d: string) {
  const diff = new Date(d).getTime() - Date.now();
  return diff > 0 && diff < 14 * 86400000;
}
function isPast(d: string) {
  return new Date(d).getTime() < Date.now();
}

/* ─── Page ───────────────────────────────────────────── */

export default function SousTraitantsPage() {
  const conformes    = soustraitants.filter((s) => s.statut === "Conforme").length;
  const nonConformes = soustraitants.filter((s) => s.statut === "Non conforme").length;
  const enAttente    = soustraitants.filter((s) => s.statut === "En attente").length;

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sous-traitants</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {soustraitants.length} enregistrés · Mis à jour il y a 3 min
          </p>
        </div>
        <RippleButton
          rippleVariant="white"
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
        >
          <UserPlus size={15} />
          Ajouter un sous-traitant
        </RippleButton>
      </div>

      {/* ── Mini KPI strip ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            count: conformes,
            label: "Conformes",
            sub: "Documents à jour",
            gradient: "linear-gradient(135deg,#10b981,#06b6d4)",
            bg: "rgba(16,185,129,0.08)",
            border: "rgba(16,185,129,0.18)",
            Icon: CheckCircle,
            iconColor: "#10b981",
          },
          {
            count: enAttente,
            label: "En attente",
            sub: "Documents manquants",
            gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
            bg: "rgba(245,158,11,0.08)",
            border: "rgba(245,158,11,0.18)",
            Icon: Clock,
            iconColor: "#f59e0b",
          },
          {
            count: nonConformes,
            label: "Non conformes",
            sub: "Action requise",
            gradient: "linear-gradient(135deg,#ef4444,#ec4899)",
            bg: "rgba(239,68,68,0.08)",
            border: "rgba(239,68,68,0.18)",
            Icon: AlertTriangle,
            iconColor: "#ef4444",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="card-lift flex items-center gap-4 p-5 rounded-2xl"
            style={{ background: "white", border: `1px solid ${s.border}`, boxShadow: `0 2px 12px ${s.bg}` }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg }}
            >
              <s.Icon size={22} style={{ color: s.iconColor }} strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-3xl font-black"
                style={{ background: s.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                {s.count}
              </p>
              <p className="text-xs font-bold text-slate-700">{s.label}</p>
              <p className="text-[11px] text-slate-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 mb-5">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un sous-traitant…"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-150"
            style={{ background: "white", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
          />
        </div>

        {/* Statut filter */}
        <select
          className="text-sm px-3 py-2.5 rounded-xl outline-none transition-all duration-150 cursor-pointer"
          style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
        >
          <option>Tous les statuts</option>
          <option>Conforme</option>
          <option>En attente</option>
          <option>Non conforme</option>
        </select>

        {/* Spécialité filter */}
        <select
          className="text-sm px-3 py-2.5 rounded-xl outline-none transition-all duration-150 cursor-pointer"
          style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
        >
          <option>Toutes les spécialités</option>
          <option>Électricité</option>
          <option>Plomberie</option>
          <option>Gros œuvre</option>
        </select>

        {/* Filter & sort buttons */}
        <RippleButton
          rippleVariant="violet"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5"
          style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <Filter size={13} /> Filtrer
        </RippleButton>
        <RippleButton
          rippleVariant="violet"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5"
          style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <ArrowUpDown size={13} /> Trier
        </RippleButton>
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(90deg,#f8fafc,#f1f5f9)", borderBottom: "1px solid #f1f5f9" }}>
              {["Sous-traitant", "Spécialité", "Statut conformité", "Prochaine échéance", "Factures", ""].map((col) => (
                <th key={col} className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {soustraitants.map((st, idx) => {
              const statut  = statutCfg[st.statut];
              const spec    = specialiteCfg[st.specialite] ?? { bg: "rgba(100,116,139,0.1)", text: "#475569" };
              const urgent  = isUrgent(st.prochaine_echeance);
              const past    = isPast(st.prochaine_echeance);
              const avatarG = avatarGradients[idx % avatarGradients.length];
              const initials = st.nom.split(/[\s&]+/).map((w: string) => w[0]).filter(Boolean).slice(0, 2).join("");

              return (
                <tr
                  key={st.nom}
                  style={{ borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  className="transition-colors duration-100 cursor-pointer"
                >
                  {/* Nom */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-black shadow-sm"
                        style={{ background: avatarG }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{st.nom}</p>
                        <p className="text-[11px] text-slate-400">SIRET: 123 456 789 00012</p>
                      </div>
                    </div>
                  </td>

                  {/* Spécialité */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: spec.bg, color: spec.text }}>
                      {st.specialite}
                    </span>
                  </td>

                  {/* Statut */}
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: statut.bg, color: statut.text }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: statut.dot, boxShadow: `0 0 5px ${statut.glow}` }}
                      />
                      {statut.label}
                    </span>
                  </td>

                  {/* Échéance */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {(urgent || past) && (
                        <AlertTriangle
                          size={13}
                          style={{ color: past ? "#dc2626" : "#d97706", flexShrink: 0 }}
                        />
                      )}
                      <span
                        className="text-sm font-semibold"
                        style={{ color: past ? "#dc2626" : urgent ? "#d97706" : "#475569" }}
                      >
                        {formatDate(st.prochaine_echeance)}
                      </span>
                      {(urgent || past) && (
                        <span
                          className="text-[10px] font-black px-1.5 py-0.5 rounded"
                          style={{ background: past ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)", color: past ? "#dc2626" : "#d97706" }}
                        >
                          {past ? "EXPIRÉ" : "URGENT"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Factures */}
                  <td className="px-5 py-3.5">
                    {st.factures_en_attente > 0 ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(245,158,11,0.1)", color: "#d97706" }}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                          style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
                        >
                          {st.factures_en_attente}
                        </span>
                        en attente
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 font-medium">—</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3.5 text-right">
                    <button
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.12)" }}
                    >
                      Voir <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid #f1f5f9", background: "#fafbff" }}
        >
          <p className="text-xs text-slate-400 font-medium">
            Affichage de <span className="font-bold text-slate-600">{soustraitants.length}</span> sous-traitants
          </p>
          <div className="flex items-center gap-1">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className="w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150"
                style={
                  p === 1
                    ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }
                    : { color: "#94a3b8" }
                }
              >
                {p}
              </button>
            ))}
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
