import Link from "next/link";
import {
  Shield,
  FileText,
  TrendingUp,
  Bell,
  BarChart2,
  Plug,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────── */

const features = [
  {
    Icon: Shield,
    gradient: "from-[#6366f1] to-[#8b5cf6]",
    shadowColor: "rgba(99,102,241,0.35)",
    title: "Conformité automatique",
    description:
      "Vérification automatique des attestations URSSAF, Kbis et assurances. Alertes avant expiration.",
  },
  {
    Icon: FileText,
    gradient: "from-[#8b5cf6] to-[#ec4899]",
    shadowColor: "rgba(139,92,246,0.35)",
    title: "Gestion des contrats",
    description:
      "Modèles conformes, signature électronique et archivage sécurisé dans le respect du RGPD.",
  },
  {
    Icon: TrendingUp,
    gradient: "from-[#10b981] to-[#06b6d4]",
    shadowColor: "rgba(16,185,129,0.35)",
    title: "Suivi financier",
    description:
      "Tableau de bord financier, suivi des factures et validation en quelques clics.",
  },
  {
    Icon: Bell,
    gradient: "from-[#f59e0b] to-[#ef4444]",
    shadowColor: "rgba(245,158,11,0.35)",
    title: "Alertes en temps réel",
    description:
      "Notifications e-mail et in-app pour les échéances critiques. Zéro surprise.",
  },
  {
    Icon: BarChart2,
    gradient: "from-[#06b6d4] to-[#6366f1]",
    shadowColor: "rgba(6,182,212,0.35)",
    title: "Rapports détaillés",
    description:
      "Exports PDF et Excel pour vos audits internes et commissaires aux comptes.",
  },
  {
    Icon: Plug,
    gradient: "from-[#ec4899] to-[#8b5cf6]",
    shadowColor: "rgba(236,72,153,0.35)",
    title: "Intégrations",
    description:
      "Compatible avec Sage, EBP, QuickBooks et vos outils RH existants.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "49€",
    period: "/ mois",
    desc: "Jusqu'à 10 sous-traitants",
    features: ["Conformité automatique", "Gestion des contrats", "Alertes e-mail", "Support standard"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "99€",
    period: "/ mois",
    desc: "Jusqu'à 50 sous-traitants",
    features: ["Tout Starter", "Suivi financier avancé", "Intégrations comptables", "Support prioritaire", "Rapports exports"],
    highlight: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    desc: "Sous-traitants illimités",
    features: ["Tout Pro", "API dédiée", "SSO / SAML", "CSM dédié", "SLA garanti 99,9%"],
    highlight: false,
  },
];

const stats = [
  { value: "2 400+", label: "PME utilisatrices" },
  { value: "98%",    label: "Taux de conformité" },
  { value: "12h",    label: "Économisées / mois" },
  { value: "0",      label: "Pénalité URSSAF" },
];

/* ─── Landing Page ───────────────────────────────────── */

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── NAVBAR ──────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 border-b"
        style={{
          background: "rgba(8,11,20,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight">SubFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            {(["#fonctionnalites", "#tarifs", "#contact"] as const).map((href, i) => (
              <a key={href} href={href} className="hover:text-white transition-colors duration-150">
                {["Fonctionnalités", "Tarifs", "Contact"][i]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>
              Connexion
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm px-5 py-2 rounded-xl">
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-28 pb-32 flex flex-col items-center text-center min-h-screen justify-center"
        style={{
          background: "linear-gradient(-45deg,#060911,#0d0824,#1e0a4a,#0d1b3e,#180840,#060c1d,#060911)",
          backgroundSize: "400% 400%",
          animation: "hero-gradient 20s ease infinite",
        }}
      >
        {/* ── Dot grid ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139,92,246,0.13) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* ── Drifting particles ── */}
        <div className="particles-layer absolute inset-0 pointer-events-none" />

        {/* ── 5 floating orbs ── */}
        {/* 1 – Violet #8b5cf6 · top-left · 12s */}
        <div
          className="orb-1 absolute pointer-events-none rounded-full"
          style={{ width: 580, height: 580, top: -160, left: -120,
            background: "radial-gradient(circle, rgba(139,92,246,0.38) 0%, transparent 68%)",
            filter: "blur(52px)" }}
        />
        {/* 2 – Indigo #6366f1 · top-right · 16s */}
        <div
          className="orb-2 absolute pointer-events-none rounded-full"
          style={{ width: 500, height: 500, top: -80, right: -90,
            background: "radial-gradient(circle, rgba(99,102,241,0.30) 0%, transparent 68%)",
            filter: "blur(56px)", animationDelay: "2s" }}
        />
        {/* 3 – Blue #3b82f6 · middle-left · 10s */}
        <div
          className="orb-3 absolute pointer-events-none rounded-full"
          style={{ width: 420, height: 420, top: "35%", left: -80,
            background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 68%)",
            filter: "blur(48px)", animationDelay: "1s" }}
        />
        {/* 4 – Rose #ec4899 · bottom-right · 14s */}
        <div
          className="orb-4 absolute pointer-events-none rounded-full"
          style={{ width: 400, height: 400, bottom: 40, right: "8%",
            background: "radial-gradient(circle, rgba(236,72,153,0.20) 0%, transparent 68%)",
            filter: "blur(44px)", animationDelay: "3.5s" }}
        />
        {/* 5 – Cyan #06b6d4 · bottom-center · 18s */}
        <div
          className="orb-5 absolute pointer-events-none rounded-full"
          style={{ width: 360, height: 360, bottom: -40, left: "32%",
            background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 68%)",
            filter: "blur(40px)", animationDelay: "5s" }}
        />

        {/* ── Horizontal glow line ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            height: 1,
            left: "4%",
            right: "4%",
            top: "64%",
            background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.55) 18%, rgba(139,92,246,0.95) 38%, rgba(255,255,255,0.9) 50%, rgba(6,182,212,0.95) 62%, rgba(99,102,241,0.55) 82%, transparent 100%)",
            boxShadow: "0 0 10px 2px rgba(139,92,246,0.55), 0 0 28px 6px rgba(99,102,241,0.28), 0 0 60px 12px rgba(99,102,241,0.12)",
            animation: "glow-line-pulse 7s ease-in-out infinite",
            transformOrigin: "center",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-6">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8"
            style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)", color: "#c4b5fd" }}
          >
            <Zap size={12} />
            Conforme URSSAF, Loi Sapin II &amp; RGPD
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Gérez vos<br />
            sous-traitants{" "}
            <span className="gradient-text">sans risque</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            SubFlow centralise la conformité, les contrats, les factures et les alertes de vos sous-traitants.
            Conçu pour les PME françaises qui veulent dormir tranquilles.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/dashboard" className="btn-primary px-9 py-4 rounded-2xl text-base font-bold inline-flex items-center justify-center gap-2">
              Démarrer gratuitement
              <ArrowRight size={18} />
            </Link>
            <a href="#fonctionnalites" className="btn-outline-light px-9 py-4 rounded-2xl text-base inline-flex items-center justify-center gap-2">
              Voir les fonctionnalités
            </a>
          </div>

          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            14 jours d'essai gratuit · Sans carte bancaire · Annulation immédiate
          </p>
        </div>

        {/* ── Stats band ── */}
        <div
          className="relative z-10 mt-20 w-full max-w-4xl mx-auto px-6 rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="px-8 py-7 text-center"
                style={{
                  borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <p
                  className="text-5xl font-black leading-none mb-1 whitespace-nowrap"
                  style={{ color: "#ffffff" }}
                >
                  {s.value}
                </p>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section id="fonctionnalites" className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1" }}
            >
              Fonctionnalités
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Une plateforme pensée pour simplifier la relation avec vos sous-traitants tout en restant conforme à la réglementation française.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-lift p-7 rounded-2xl border border-slate-100 bg-white group"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-200`}
                  style={{ boxShadow: `0 4px 14px ${f.shadowColor}` }}
                >
                  <f.Icon size={22} color="white" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ─────────────────────────────── */}
      <section className="py-16 px-6 border-y" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">
            Intégrations disponibles
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Sage", "EBP", "QuickBooks", "Pennylane", "Sellsy", "Cegid"].map((name) => (
              <div
                key={name}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-500 transition-all duration-200 hover:text-slate-800 hover:shadow-sm hover:-translate-y-0.5"
                style={{ background: "white", border: "1px solid #e2e8f0" }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section
        id="tarifs"
        className="relative overflow-hidden py-28 px-6"
        style={{ background: "#0a0a1a" }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139,92,246,0.12) 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />

        {/* 4 floating orbs */}
        {/* 1 – Violet · top-right */}
        <div
          className="orb-1 absolute pointer-events-none rounded-full"
          style={{ width: 480, height: 480, top: -100, right: -80,
            background: "radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 65%)",
            filter: "blur(52px)" }}
        />
        {/* 2 – Indigo · top-left */}
        <div
          className="orb-2 absolute pointer-events-none rounded-full"
          style={{ width: 420, height: 420, top: 40, left: -70,
            background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)",
            filter: "blur(48px)", animationDelay: "2.5s" }}
        />
        {/* 3 – Blue · bottom-left */}
        <div
          className="orb-3 absolute pointer-events-none rounded-full"
          style={{ width: 380, height: 380, bottom: -60, left: "12%",
            background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)",
            filter: "blur(44px)", animationDelay: "1.5s" }}
        />
        {/* 4 – Rose · bottom-right */}
        <div
          className="orb-4 absolute pointer-events-none rounded-full"
          style={{ width: 340, height: 340, bottom: -30, right: "10%",
            background: "radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 65%)",
            filter: "blur(40px)", animationDelay: "4s" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{ background: "rgba(99,102,241,0.2)", color: "#c4b5fd" }}
            >
              Tarifs
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Simple et transparent</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Sans engagement, sans surprise. Changez de plan à tout moment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) =>
              plan.highlight ? (
                <div
                  key={plan.name}
                  className="relative rounded-2xl p-8"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.18))",
                    border: "1px solid rgba(99,102,241,0.5)",
                    boxShadow: "0 0 48px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full mb-4"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white" }}
                  >
                    <Zap size={10} /> Le plus populaire
                  </div>
                  <p className="text-xl font-black text-white">{plan.name}</p>
                  <div className="flex items-end gap-1 mt-2 mb-1">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>{plan.period}</span>}
                  </div>
                  <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.5)" }}>{plan.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                        <CheckCircle size={15} className="flex-shrink-0" style={{ color: "#a78bfa" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard" className="btn-primary block text-center py-3 rounded-xl text-sm font-bold">
                    Commencer maintenant →
                  </Link>
                </div>
              ) : (
                <div key={plan.name} className="glass-card rounded-2xl p-8">
                  <p className="text-xl font-black text-white">{plan.name}</p>
                  <div className="flex items-end gap-1 mt-2 mb-1">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.period}</span>}
                  </div>
                  <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <CheckCircle size={15} className="flex-shrink-0" style={{ color: "rgba(167,139,250,0.7)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard"
                    className="block text-center py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-white/15"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}
                  >
                    Commencer
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-32 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #a855f7 100%)" }}
      >
        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        {/* Orb 1 – white · top-left */}
        <div className="orb-4 absolute pointer-events-none rounded-full"
          style={{ width: 560, height: 560, top: -140, left: -100, background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 68%)", filter: "blur(60px)" }} />
        {/* Orb 2 – white · top-right */}
        <div className="orb-1 absolute pointer-events-none rounded-full"
          style={{ width: 480, height: 480, top: -80, right: -80, background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 68%)", filter: "blur(54px)", animationDelay: "2s" }} />
        {/* Orb 3 – white · bottom-center */}
        <div className="orb-5 absolute pointer-events-none rounded-full"
          style={{ width: 400, height: 400, bottom: -80, left: "34%", background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 68%)", filter: "blur(48px)", animationDelay: "4s" }} />

        {/* Light beams – white */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: "absolute", width: "24%", height: "200%", top: "-50%", left: 0, background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%)", animation: "light-beam-sweep 8s ease-in-out 0.5s infinite" }} />
          <div style={{ position: "absolute", width: "14%", height: "200%", top: "-50%", left: 0, background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)", animation: "light-beam-sweep 8s ease-in-out 4.5s infinite" }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8"
            style={{ background: "rgba(255,255,255,0.20)", border: "1px solid rgba(255,255,255,0.30)", color: "#ffffff" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }} />
            Rejoignez 2 400+ PME françaises
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight leading-tight" style={{ color: "#ffffff" }}>
            Prêt à sécuriser vos relations sous-traitants ?
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            Démarrez votre essai gratuit aujourd'hui. Aucune carte bancaire requise,<br className="hidden md:block" />
            configuration en moins de 10 minutes.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            style={{ background: "#1e1b4b", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
            Essayer SubFlow gratuitement
            <ArrowRight size={18} />
          </Link>
          <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>14 jours d'essai · Sans carte bancaire · Annulation immédiate</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer id="contact" className="py-12 px-6" style={{ background: "#060911", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-white text-lg">SubFlow</span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>© 2026 SubFlow SAS · Paris, France · contact@subflow.fr</p>
          <div className="flex gap-5 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            {["CGU", "Confidentialité", "Mentions légales"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
