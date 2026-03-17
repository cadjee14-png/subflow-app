"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
          left: "-8%",
          background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="orb-2 absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          bottom: "-5%",
          right: "-6%",
          background: "radial-gradient(circle, rgba(139,92,246,0.30) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      <div
        className="orb-3 absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          top: "40%",
          right: "15%",
          background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)",
          filter: "blur(36px)",
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

        <h1 className="text-2xl font-black text-white mb-1">Connexion</h1>
        <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.45)" }}>
          Accédez à votre espace de gestion.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-150 placeholder:opacity-30"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(99,102,241,0.6)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Mot de passe
              </label>
              <Link
                href="#"
                className="text-xs font-semibold transition-colors hover:text-indigo-300"
                style={{ color: "rgba(129,140,248,0.9)" }}
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white outline-none transition-all duration-150 placeholder:opacity-30"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(99,102,241,0.6)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
                  e.currentTarget.style.boxShadow = "none";
                }}
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
                <span>Se connecter</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold transition-colors hover:text-indigo-300"
            style={{ color: "rgba(129,140,248,0.9)" }}
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
