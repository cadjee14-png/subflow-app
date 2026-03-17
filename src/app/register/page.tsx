"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Un compte existe déjà avec cet email."
          : error.message
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-150 placeholder:opacity-30";
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  };
  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.border = "1px solid rgba(99,102,241,0.6)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
    e.currentTarget.style.boxShadow = "none";
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden hero-animated-bg">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Floating orbs */}
      <div
        className="orb-1 absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          top: "-10%",
          right: "-8%",
          background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="orb-2 absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          bottom: "-5%",
          left: "-6%",
          background: "radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Card */}
      <div
        className="animate-fade-up relative z-10 w-full max-w-md mx-4 rounded-2xl p-8 glass-card"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <span className="text-white font-black text-sm">S</span>
          </div>
          <div>
            <p className="font-black text-white text-lg leading-none tracking-tight">SubFlow</p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Gestion de sous-traitants
            </p>
          </div>
        </div>

        {success ? (
          /* Success state */
          <div className="py-4 text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                <CheckCircle2 size={28} style={{ color: "#34d399" }} />
              </div>
            </div>
            <h2 className="text-xl font-black text-white mb-2">Vérifiez votre email</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Un lien de confirmation a été envoyé à{" "}
              <span className="text-white font-semibold">{email}</span>.
              Cliquez sur le lien pour activer votre compte.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-indigo-300"
              style={{ color: "rgba(129,140,248,0.9)" }}
            >
              Retour à la connexion
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black text-white mb-1">Créer un compte</h1>
            <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.45)" }}>
              Rejoignez SubFlow et gérez vos sous-traitants.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marie Aubert"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Mot de passe
                  <span className="ml-1.5 font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>
                    (8 caractères min.)
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-11`}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#fca5a5",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Déjà un compte ?{" "}
              <Link
                href="/login"
                className="font-semibold transition-colors hover:text-indigo-300"
                style={{ color: "rgba(129,140,248,0.9)" }}
              >
                Se connecter
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
