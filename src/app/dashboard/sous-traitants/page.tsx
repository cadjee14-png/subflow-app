"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle, Clock, AlertTriangle, Search, Filter, ArrowUpDown,
  ArrowRight, UserPlus, ChevronLeft, ChevronRight, Trash2, X,
  Loader2, Building2, FileText, Upload, Download, FolderOpen,
} from "lucide-react";
import { RippleButton } from "@/components/RippleButton";
import { createClient } from "@/lib/supabase/client";

/* ─── Types ───────────────────────────────────────────── */

type SousTraitant = {
  id: string;
  nom: string;
  specialite: string;
  email: string | null;
  telephone: string | null;
  statut_conformite: "Conforme" | "En attente" | "Non conforme";
  prochaine_echeance: string | null;
  created_at: string;
};

type Document = {
  id: string;
  sous_traitant_id: string;
  nom: string;
  type_document: string;
  url: string;
  date_expiration: string | null;
  created_at: string;
};

type STFormData = {
  nom: string; specialite: string; email: string; telephone: string;
  statut_conformite: "Conforme" | "En attente" | "Non conforme";
  prochaine_echeance: string;
};

/* ─── Config ──────────────────────────────────────────── */

const SPECIALITES = [
  "Électricité", "Plomberie", "Menuiserie", "Peinture", "Isolation",
  "Gros œuvre", "Charpente", "Carrelage", "CVC", "Sécurité incendie",
  "Paysagisme", "Nettoyage", "Autre",
];

const TYPE_DOCS = ["Kbis", "Assurance RC Pro", "Attestation URSSAF", "Autre"];

const typeDocCfg: Record<string, { bg: string; text: string }> = {
  "Kbis":               { bg: "rgba(99,102,241,0.1)",  text: "#4338ca" },
  "Assurance RC Pro":   { bg: "rgba(16,185,129,0.1)",  text: "#059669" },
  "Attestation URSSAF": { bg: "rgba(245,158,11,0.1)",  text: "#d97706" },
  "Autre":              { bg: "rgba(100,116,139,0.1)", text: "#475569" },
};

const statutCfg: Record<string, { label: string; bg: string; text: string; dot: string; glow: string }> = {
  Conforme:       { label: "Conforme",     bg: "rgba(16,185,129,0.1)", text: "#059669", dot: "#10b981", glow: "rgba(16,185,129,0.45)" },
  "En attente":   { label: "En attente",   bg: "rgba(245,158,11,0.1)", text: "#d97706", dot: "#f59e0b", glow: "rgba(245,158,11,0.45)" },
  "Non conforme": { label: "Non conforme", bg: "rgba(239,68,68,0.1)",  text: "#dc2626", dot: "#ef4444", glow: "rgba(239,68,68,0.45)"  },
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

const EMPTY_FORM: STFormData = {
  nom: "", specialite: "Électricité", email: "", telephone: "",
  statut_conformite: "En attente", prochaine_echeance: "",
};

/* ─── Utils ───────────────────────────────────────────── */

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function isUrgent(d: string) { const diff = new Date(d).getTime() - Date.now(); return diff > 0 && diff < 14 * 86400000; }
function isPast(d: string) { return new Date(d).getTime() < Date.now(); }
function initials(nom: string) { return nom.split(/[\s&]+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase(); }

function docStatut(date: string | null): { label: string; bg: string; text: string; dot: string } {
  if (!date) return { label: "Sans échéance", bg: "rgba(100,116,139,0.1)", text: "#64748b", dot: "#94a3b8" };
  const diff = new Date(date).getTime() - Date.now();
  if (diff < 0)              return { label: "Expiré",          bg: "rgba(239,68,68,0.1)",  text: "#dc2626", dot: "#ef4444" };
  if (diff < 30 * 86400000)  return { label: "Expirant bientôt", bg: "rgba(245,158,11,0.1)", text: "#d97706", dot: "#f59e0b" };
  return                            { label: "Valide",           bg: "rgba(16,185,129,0.1)", text: "#059669", dot: "#10b981" };
}

/* ─── Input helpers ───────────────────────────────────── */

const inputCls = "w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all duration-150";
const inputStyle = { background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" };
function onFocusInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
}
function onBlurInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none";
}

/* ─── DocFileIcon ─────────────────────────────────────── */

function DocFileIcon({ nom }: { nom: string }) {
  const ext = nom.split(".").pop()?.toLowerCase();
  if (ext === "pdf") {
    return (
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>
        PDF
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(14,165,233,0.1)" }}>
      <FileText size={18} style={{ color: "#0891b2" }} />
    </div>
  );
}

/* ─── DocumentsModal ──────────────────────────────────── */

function DocumentsModal({ st, onClose }: { st: SousTraitant; onClose: () => void }) {
  const [docs, setDocs]               = useState<Document[]>([]);
  const [loading, setLoading]         = useState(true);
  const [signedUrls, setSignedUrls]   = useState<Record<string, string>>({});
  const [file, setFile]               = useState<File | null>(null);
  const [typeDoc, setTypeDoc]         = useState("Kbis");
  const [expiry, setExpiry]           = useState("");
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [dragOver, setDragOver]       = useState(false);
  const fileRef                       = useRef<HTMLInputElement>(null);

  /* ── Fetch docs + signed URLs ── */
  const fetchDocs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("sous_traitant_id", st.id)
      .order("created_at", { ascending: false });

    if (data) {
      setDocs(data);
      const urls: Record<string, string> = {};
      await Promise.all(
        data.map(async (doc) => {
          const { data: signed } = await supabase.storage
            .from("Documents")
            .createSignedUrl(doc.url, 3600);
          if (signed) urls[doc.id] = signed.signedUrl;
        })
      );
      setSignedUrls(urls);
    }
    setLoading(false);
  }, [st.id]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  /* ── Select file ── */
  function handleFileChange(f: File | null) {
    if (!f) return;
    setUploadError(null);
    if (f.size > 10 * 1024 * 1024) { setUploadError("Le fichier ne doit pas dépasser 10 MB."); return; }
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(f.type)) { setUploadError("Format non supporté. Utilisez PDF, JPG ou PNG."); return; }
    setFile(f);
  }

  /* ── Upload ── */
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const path = `${user!.id}/${st.id}/${safeName}`;

    const { error: storErr } = await supabase.storage.from("Documents").upload(path, file, { contentType: file.type });
    if (storErr) { setUploadError(storErr.message); setUploading(false); return; }

    const { error: dbErr } = await supabase.from("documents").insert({
      user_id: user!.id,
      sous_traitant_id: st.id,
      nom: file.name,
      type_document: typeDoc,
      url: path,
      date_expiration: expiry || null,
    });
    if (dbErr) { setUploadError(dbErr.message); setUploading(false); return; }

    setFile(null);
    setExpiry("");
    if (fileRef.current) fileRef.current.value = "";
    await fetchDocs();
    setUploading(false);
  }

  /* ── Delete doc ── */
  async function handleDeleteDoc(doc: Document) {
    const supabase = createClient();
    await supabase.storage.from("Documents").remove([doc.url]);
    await supabase.from("documents").delete().eq("id", doc.id);
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    setDeletingDocId(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fade-up w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "88vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: avatarGradients[0] }}>
              {initials(st.nom)}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">{st.nom}</h2>
              <p className="text-xs text-slate-400">Documents de conformité</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-slate-100 text-slate-400">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* ── Documents list ── */}
          <div className="px-6 py-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              Documents enregistrés
              {!loading && <span className="ml-2 font-bold normal-case tracking-normal text-slate-300">({docs.length})</span>}
            </p>

            {loading ? (
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f8fafc" }}>
                    <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: "#e2e8f0" }} />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 rounded animate-pulse" style={{ background: "#e2e8f0", width: "60%" }} />
                      <div className="h-3 rounded animate-pulse" style={{ background: "#f1f5f9", width: "40%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : docs.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 py-10 rounded-2xl" style={{ background: "#f8fafc", border: "1px dashed #e2e8f0" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.08)" }}>
                  <FolderOpen size={22} style={{ color: "#6366f1" }} />
                </div>
                <p className="text-sm font-bold text-slate-500">Aucun document</p>
                <p className="text-xs text-slate-400">Uploadez le premier document ci-dessous</p>
              </div>
            ) : (
              <div className="space-y-2">
                {docs.map((doc) => {
                  const statut  = docStatut(doc.date_expiration);
                  const typeCfg = typeDocCfg[doc.type_document] ?? typeDocCfg["Autre"];
                  const isDeleting = deletingDocId === doc.id;

                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-100"
                      style={{ background: isDeleting ? "rgba(239,68,68,0.04)" : "#f8fafc", border: isDeleting ? "1px solid rgba(239,68,68,0.15)" : "1px solid transparent" }}
                    >
                      <DocFileIcon nom={doc.nom} />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{doc.nom}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {/* Type badge */}
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: typeCfg.bg, color: typeCfg.text }}>
                            {doc.type_document}
                          </span>
                          {/* Status badge */}
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: statut.bg, color: statut.text }}>
                            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: statut.dot }} />
                            {statut.label}
                          </span>
                          {/* Expiry */}
                          {doc.date_expiration && (
                            <span className="text-[10px] text-slate-400">{formatDate(doc.date_expiration)}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {isDeleting ? (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleDeleteDoc(doc)}
                            className="text-[11px] font-black px-2.5 py-1.5 rounded-lg"
                            style={{ background: "rgba(239,68,68,0.12)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setDeletingDocId(null)}
                            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg"
                            style={{ background: "#f1f5f9", color: "#64748b" }}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {signedUrls[doc.id] && (
                            <a
                              href={signedUrls[doc.id]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-indigo-50"
                              style={{ color: "#cbd5e1" }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = "#6366f1"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
                              title="Télécharger"
                            >
                              <Download size={14} />
                            </a>
                          )}
                          <button
                            onClick={() => setDeletingDocId(doc.id)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-red-50"
                            style={{ color: "#cbd5e1" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="mx-6" style={{ borderTop: "1px solid #f1f5f9" }} />

          {/* ── Upload form ── */}
          <form onSubmit={handleUpload} className="px-6 py-5 space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Ajouter un document</p>

            {/* Drop zone */}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            <div
              className="rounded-xl p-5 text-center cursor-pointer transition-all duration-150"
              style={{
                border: `2px dashed ${dragOver ? "#6366f1" : file ? "#10b981" : "#e2e8f0"}`,
                background: dragOver ? "rgba(99,102,241,0.04)" : file ? "rgba(16,185,129,0.03)" : "#f8fafc",
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0] ?? null); }}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <DocFileIcon nom={file.name} />
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="ml-2 w-6 h-6 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0"
                    style={{ color: "#94a3b8" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={22} className="mx-auto mb-2" style={{ color: "#cbd5e1" }} />
                  <p className="text-sm font-medium text-slate-500">
                    Glissez un fichier ou{" "}
                    <span className="font-semibold" style={{ color: "#6366f1" }}>cliquez pour parcourir</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG · 10 MB max</p>
                </>
              )}
            </div>

            {/* Type + Date expiration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type de document <span className="text-red-400">*</span></label>
                <select
                  value={typeDoc}
                  onChange={(e) => setTypeDoc(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                >
                  {TYPE_DOCS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date d'expiration</label>
                <input
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </div>
            </div>

            {/* Error */}
            {uploadError && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {uploadError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!file || uploading}
              className="btn-primary w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Loader2 size={15} className="animate-spin" /> Upload en cours…</>
              ) : (
                <><Upload size={15} /> Uploader le document</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Page principale ─────────────────────────────────── */

export default function SousTraitantsPage() {
  const [data, setData]                   = useState<SousTraitant[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [filterStatut, setFilterStatut]   = useState("Tous les statuts");
  const [filterSpec, setFilterSpec]       = useState("Toutes les spécialités");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [form, setForm]                   = useState<STFormData>(EMPTY_FORM);
  const [saving, setSaving]               = useState(false);
  const [formError, setFormError]         = useState<string | null>(null);
  const [docsModal, setDocsModal]         = useState<SousTraitant | null>(null);

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: rows } = await supabase
      .from("sous_traitants").select("*").order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Create ── */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("sous_traitants").insert({
      user_id: user!.id,
      nom: form.nom, specialite: form.specialite,
      email: form.email || null, telephone: form.telephone || null,
      statut_conformite: form.statut_conformite,
      prochaine_echeance: form.prochaine_echeance || null,
    });
    if (error) { setFormError(error.message); setSaving(false); return; }
    setShowCreateModal(false);
    setForm(EMPTY_FORM);
    await fetchData();
    setSaving(false);
  }

  /* ── Delete sous-traitant ── */
  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("sous_traitants").delete().eq("id", id);
    setData((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  }

  /* ── Filter ── */
  const filtered = data.filter((st) => {
    const q = search.toLowerCase();
    return (
      (!search || st.nom.toLowerCase().includes(q) || st.specialite.toLowerCase().includes(q) || (st.email ?? "").toLowerCase().includes(q)) &&
      (filterStatut === "Tous les statuts" || st.statut_conformite === filterStatut) &&
      (filterSpec === "Toutes les spécialités" || st.specialite === filterSpec)
    );
  });

  const conformes    = data.filter((s) => s.statut_conformite === "Conforme").length;
  const enAttente    = data.filter((s) => s.statut_conformite === "En attente").length;
  const nonConformes = data.filter((s) => s.statut_conformite === "Non conforme").length;

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sous-traitants</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? "Chargement…" : `${data.length} enregistré${data.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <RippleButton
          rippleVariant="white"
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
          onClick={() => setShowCreateModal(true)}
        >
          <UserPlus size={15} />
          Ajouter un sous-traitant
        </RippleButton>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { count: conformes,    label: "Conformes",     sub: "Documents à jour",    gradient: "linear-gradient(135deg,#10b981,#06b6d4)", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.18)", Icon: CheckCircle,   iconColor: "#10b981" },
          { count: enAttente,    label: "En attente",    sub: "Documents manquants", gradient: "linear-gradient(135deg,#f59e0b,#f97316)", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)", Icon: Clock,         iconColor: "#f59e0b" },
          { count: nonConformes, label: "Non conformes", sub: "Action requise",       gradient: "linear-gradient(135deg,#ef4444,#ec4899)", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.18)",  Icon: AlertTriangle, iconColor: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="card-lift flex items-center gap-4 p-5 rounded-2xl" style={{ background: "white", border: `1px solid ${s.border}`, boxShadow: `0 2px 12px ${s.bg}` }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.Icon size={22} style={{ color: s.iconColor }} strokeWidth={2} />
            </div>
            <div>
              <p className="text-3xl font-black" style={{ background: s.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {loading ? "—" : s.count}
              </p>
              <p className="text-xs font-bold text-slate-700">{s.label}</p>
              <p className="text-[11px] text-slate-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un sous-traitant…"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-150"
            style={{ background: "white", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
          />
        </div>
        <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl outline-none cursor-pointer" style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569" }}>
          <option>Tous les statuts</option>
          <option>Conforme</option><option>En attente</option><option>Non conforme</option>
        </select>
        <select value={filterSpec} onChange={(e) => setFilterSpec(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl outline-none cursor-pointer" style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569" }}>
          <option>Toutes les spécialités</option>
          {SPECIALITES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <RippleButton rippleVariant="violet" className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all duration-150" style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569" }}>
          <Filter size={13} /> Filtrer
        </RippleButton>
        <RippleButton rippleVariant="violet" className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all duration-150" style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569" }}>
          <ArrowUpDown size={13} /> Trier
        </RippleButton>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(90deg,#f8fafc,#f1f5f9)", borderBottom: "1px solid #f1f5f9" }}>
              {["Sous-traitant", "Spécialité", "Statut conformité", "Prochaine échéance", "Contact", ""].map((col) => (
                <th key={col} className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Loading skeleton */}
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-5 py-4">
                    <div className="h-4 rounded-lg animate-pulse" style={{ background: "#f1f5f9", width: j === 0 ? "160px" : j === 5 ? "80px" : "90px" }} />
                  </td>
                ))}
              </tr>
            ))}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.08)" }}>
                      <Building2 size={24} style={{ color: "#6366f1" }} />
                    </div>
                    <p className="text-sm font-bold text-slate-600">
                      {search || filterStatut !== "Tous les statuts" || filterSpec !== "Toutes les spécialités"
                        ? "Aucun résultat pour ces filtres" : "Aucun sous-traitant enregistré"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {search || filterStatut !== "Tous les statuts" || filterSpec !== "Toutes les spécialités"
                        ? "Modifiez vos critères de recherche" : "Cliquez sur « Ajouter un sous-traitant » pour commencer"}
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* Rows */}
            {!loading && filtered.map((st, idx) => {
              const statut     = statutCfg[st.statut_conformite] ?? statutCfg["En attente"];
              const spec       = specialiteCfg[st.specialite] ?? { bg: "rgba(100,116,139,0.1)", text: "#475569" };
              const urgent     = st.prochaine_echeance ? isUrgent(st.prochaine_echeance) : false;
              const past       = st.prochaine_echeance ? isPast(st.prochaine_echeance) : false;
              const avatarG    = avatarGradients[idx % avatarGradients.length];
              const isDeleting = deletingId === st.id;

              return (
                <tr
                  key={st.id}
                  style={{ borderBottom: "1px solid #f8fafc", background: isDeleting ? "rgba(239,68,68,0.03)" : "" }}
                  onMouseEnter={(e) => { if (!isDeleting) e.currentTarget.style.background = "#fafbff"; }}
                  onMouseLeave={(e) => { if (!isDeleting) e.currentTarget.style.background = ""; }}
                  className="transition-colors duration-100"
                >
                  {/* Nom */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-black shadow-sm" style={{ background: avatarG }}>
                        {initials(st.nom)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{st.nom}</p>
                        <p className="text-[11px] text-slate-400">{st.email ?? "Pas d'email"}</p>
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
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: statut.bg, color: statut.text }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statut.dot, boxShadow: `0 0 5px ${statut.glow}` }} />
                      {statut.label}
                    </span>
                  </td>

                  {/* Échéance */}
                  <td className="px-5 py-3.5">
                    {st.prochaine_echeance ? (
                      <div className="flex items-center gap-2">
                        {(urgent || past) && <AlertTriangle size={13} style={{ color: past ? "#dc2626" : "#d97706", flexShrink: 0 }} />}
                        <span className="text-sm font-semibold" style={{ color: past ? "#dc2626" : urgent ? "#d97706" : "#475569" }}>
                          {formatDate(st.prochaine_echeance)}
                        </span>
                        {(urgent || past) && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: past ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)", color: past ? "#dc2626" : "#d97706" }}>
                            {past ? "EXPIRÉ" : "URGENT"}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 font-medium">—</span>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-slate-500">{st.telephone ?? "—"}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    {isDeleting ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-slate-500 font-medium">Supprimer ?</span>
                        <button onClick={() => handleDelete(st.id)} className="text-[11px] font-black px-2.5 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.12)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}>
                          Confirmer
                        </button>
                        <button onClick={() => setDeletingId(null)} className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg" style={{ background: "#f1f5f9", color: "#64748b" }}>
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setDeletingId(st.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-red-50"
                          style={{ color: "#cbd5e1" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => setDocsModal(st)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                          style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.12)" }}
                        >
                          <FileText size={12} /> Documents
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                          style={{ background: "rgba(15,23,42,0.05)", color: "#475569", border: "1px solid rgba(15,23,42,0.06)" }}
                        >
                          Voir <ArrowRight size={12} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #f1f5f9", background: "#fafbff" }}>
          <p className="text-xs text-slate-400 font-medium">
            {loading ? "…" : (
              <>
                <span className="font-bold text-slate-600">{filtered.length}</span>
                {filtered.length !== data.length && <> sur <span className="font-bold text-slate-600">{data.length}</span></>}
                {" "}sous-traitant{filtered.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><ChevronLeft size={14} /></button>
            <button className="w-8 h-8 rounded-lg text-xs font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }}>1</button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* ── Modal : Nouveau sous-traitant ── */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowCreateModal(false); setForm(EMPTY_FORM); setFormError(null); } }}
        >
          <div className="animate-fade-up w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <h2 className="text-base font-black text-slate-900">Nouveau sous-traitant</h2>
                <p className="text-xs text-slate-400 mt-0.5">Remplissez les informations ci-dessous</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); setForm(EMPTY_FORM); setFormError(null); }} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-slate-100 text-slate-400">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom de l'entreprise <span className="text-red-400">*</span></label>
                <input required value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} placeholder="Ex : Électricité Moreau SARL" className={inputCls} style={inputStyle} onFocus={onFocusInput} onBlur={onBlurInput} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Spécialité <span className="text-red-400">*</span></label>
                  <select required value={form.specialite} onChange={(e) => setForm((f) => ({ ...f, specialite: e.target.value }))} className={inputCls} style={inputStyle} onFocus={onFocusInput} onBlur={onBlurInput}>
                    {SPECIALITES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Statut conformité</label>
                  <select value={form.statut_conformite} onChange={(e) => setForm((f) => ({ ...f, statut_conformite: e.target.value as STFormData["statut_conformite"] }))} className={inputCls} style={inputStyle} onFocus={onFocusInput} onBlur={onBlurInput}>
                    <option>En attente</option><option>Conforme</option><option>Non conforme</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="contact@entreprise.fr" className={inputCls} style={inputStyle} onFocus={onFocusInput} onBlur={onBlurInput} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Téléphone</label>
                  <input type="tel" value={form.telephone} onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))} placeholder="06 12 34 56 78" className={inputCls} style={inputStyle} onFocus={onFocusInput} onBlur={onBlurInput} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prochaine échéance</label>
                <input type="date" value={form.prochaine_echeance} onChange={(e) => setForm((f) => ({ ...f, prochaine_echeance: e.target.value }))} className={inputCls} style={inputStyle} onFocus={onFocusInput} onBlur={onBlurInput} />
              </div>
              {formError && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{formError}
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowCreateModal(false); setForm(EMPTY_FORM); setFormError(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all duration-150" style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal : Documents ── */}
      {docsModal && (
        <DocumentsModal
          key={docsModal.id}
          st={docsModal}
          onClose={() => setDocsModal(null)}
        />
      )}
    </div>
  );
}
