"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  FileCheck2,
  ShieldCheck,
  BarChart2,
  Bell,
  ChevronDown,
  Settings,
  HelpCircle,
  Plus,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RippleButton } from "@/components/RippleButton";

const navItems: Array<{ href: string; label: string; Icon: LucideIcon }> = [
  { href: "/dashboard",                 label: "Tableau de bord", Icon: LayoutDashboard },
  { href: "/dashboard/sous-traitants",  label: "Sous-traitants",  Icon: Users           },
  { href: "/dashboard/factures",        label: "Factures",        Icon: Receipt         },
  { href: "/dashboard/contrats",        label: "Contrats",        Icon: FileCheck2      },
  { href: "/dashboard/conformite",      label: "Conformité",      Icon: ShieldCheck     },
  { href: "/dashboard/rapports",        label: "Rapports",        Icon: BarChart2       },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" style={{ background: "#f1f5f9" }}>

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside
        className="w-64 flex flex-col fixed top-0 left-0 h-screen z-40"
        style={{ background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              <span className="text-white font-black text-sm">S</span>
            </div>
            <div>
              <p className="font-black text-white text-base leading-none tracking-tight">SubFlow</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Company selector */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <button
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 text-left"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}
            >
              AB
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">ACME BTP SAS</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Plan Pro</p>
            </div>
            <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
            Navigation
          </p>
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${active ? "nav-item-active" : ""}`}
                style={active ? {} : { color: "rgba(255,255,255,0.45)" }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.9)"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = ""; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
              >
                <Icon
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: active ? "#818cf8" : "inherit" }}
                />
                <span>{label}</span>
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#818cf8", boxShadow: "0 0 6px #818cf8" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Help card */}
        <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div
            className="rounded-xl p-3 mb-3"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={13} style={{ color: "#818cf8" }} />
              <p className="text-xs font-bold text-white">Besoin d'aide ?</p>
            </div>
            <p className="text-[11px] mb-2 ml-5" style={{ color: "rgba(255,255,255,0.45)" }}>
              Documentation et support disponibles.
            </p>
            <button
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 w-full text-center"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
            >
              Ouvrir la documentation
            </button>
          </div>

          {/* User */}
          <div className="flex items-center gap-2.5 px-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              MA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Marie Aubert</p>
              <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>marie@acmebtp.fr</p>
            </div>
            <button className="p-1 rounded-lg transition-colors hover:bg-white/10" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Settings size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 px-8 py-3.5 flex items-center justify-between"
          style={{
            background: "rgba(241,245,249,0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">ACME BTP SAS</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700">Dashboard</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-text transition-all duration-150 hover:bg-white"
              style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <Search size={13} className="text-slate-400" />
              <span className="text-xs text-slate-400">Rechercher…</span>
              <kbd
                className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: "rgba(0,0,0,0.06)", color: "#94a3b8" }}
              >
                ⌘K
              </kbd>
            </div>

            {/* Notif */}
            <button
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 transition-all duration-150 hover:bg-white hover:shadow-sm hover:text-slate-800"
              style={{ background: "rgba(0,0,0,0.04)" }}
            >
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                style={{ background: "#ef4444", borderColor: "#f1f5f9" }}
              />
            </button>

            {/* Add button with ripple */}
            <RippleButton
              className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-1.5"
              rippleVariant="white"
            >
              <Plus size={15} />
              <span>Ajouter</span>
            </RippleButton>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
