import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/* ─── Types ───────────────────────────────────────────── */

type DocRow = {
  id: string;
  nom: string;
  type_document: string;
  date_expiration: string;
  sous_traitants: { nom: string } | null;
};

/* ─── Utils ───────────────────────────────────────────── */

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

/* ─── Email HTML ──────────────────────────────────────── */

function buildEmailHtml(docs: DocRow[], userEmail: string): string {
  const expires   = docs.filter((d) => daysUntil(d.date_expiration) < 0);
  const expirant  = docs.filter((d) => daysUntil(d.date_expiration) >= 0);
  const total     = docs.length;
  const today     = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  function docRows(list: DocRow[], accent: string, label: string) {
    if (list.length === 0) return "";
    const header = `
      <tr>
        <td colspan="4" style="padding:16px 0 8px;">
          <p style="margin:0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${accent};">${label}</p>
        </td>
      </tr>`;
    const rows = list.map((doc) => {
      const days    = daysUntil(doc.date_expiration);
      const isExp   = days < 0;
      const badge   = isExp
        ? `<span style="background:rgba(239,68,68,0.12);color:#dc2626;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;">Expiré</span>`
        : `<span style="background:rgba(245,158,11,0.12);color:#d97706;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;">J-${days}</span>`;
      return `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:12px 8px 12px 0;font-size:13px;font-weight:600;color:#1e293b;">${doc.nom}</td>
          <td style="padding:12px 8px;font-size:12px;color:#64748b;">${doc.type_document}</td>
          <td style="padding:12px 8px;font-size:12px;color:#64748b;">${doc.sous_traitants?.nom ?? "—"}</td>
          <td style="padding:12px 0 12px 8px;text-align:right;white-space:nowrap;">
            <span style="font-size:12px;color:#94a3b8;margin-right:8px;">${fmtDate(doc.date_expiration)}</span>
            ${badge}
          </td>
        </tr>`;
    }).join("");
    return header + rows;
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Alertes de conformité — SubFlow</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- ── En-tête dégradé ── -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 45%,#4c1d95 100%);border-radius:20px 20px 0 0;padding:36px 40px 32px;">
            <!-- Logo -->
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;width:42px;height:42px;text-align:center;vertical-align:middle;">
                <span style="color:white;font-weight:900;font-size:18px;line-height:42px;">S</span>
              </td>
              <td style="padding-left:12px;vertical-align:middle;">
                <p style="margin:0;color:white;font-weight:900;font-size:19px;letter-spacing:-0.5px;line-height:1.2;">SubFlow</p>
                <p style="margin:0;color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.2px;">Gestion de sous-traitants</p>
              </td>
            </tr></table>

            <!-- Titre -->
            <h1 style="margin:28px 0 10px;color:white;font-size:24px;font-weight:900;letter-spacing:-0.5px;line-height:1.2;">
              Alerte conformité
            </h1>
            <p style="margin:0;color:rgba(255,255,255,0.65);font-size:14px;line-height:1.7;">
              <strong style="color:white;">${total} document${total > 1 ? "s" : ""}</strong>
              ${total > 1 ? "nécessitent" : "nécessite"} votre attention.<br>
              Généré le ${today}.
            </p>
          </td>
        </tr>

        <!-- ── Bandeau résumé ── -->
        <tr>
          <td style="background:white;padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f1f5f9;padding:20px 0;">
              <tr>
                <td style="text-align:center;padding:16px 0;">
                  <p style="margin:0;font-size:28px;font-weight:900;color:#dc2626;">${expires.length}</p>
                  <p style="margin:4px 0 0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Expirés</p>
                </td>
                <td style="width:1px;background:#f1f5f9;"></td>
                <td style="text-align:center;padding:16px 0;">
                  <p style="margin:0;font-size:28px;font-weight:900;color:#d97706;">${expirant.length}</p>
                  <p style="margin:4px 0 0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Expirant bientôt</p>
                </td>
                <td style="width:1px;background:#f1f5f9;"></td>
                <td style="text-align:center;padding:16px 0;">
                  <p style="margin:0;font-size:28px;font-weight:900;color:#6366f1;">${total}</p>
                  <p style="margin:4px 0 0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Total concernés</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Corps : tableau documents ── -->
        <tr>
          <td style="background:white;padding:8px 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${docRows(expires,  "#dc2626", "🔴 Documents expirés")}
              ${docRows(expirant, "#d97706", "🟡 Expirant dans moins de 30 jours")}
            </table>
          </td>
        </tr>

        <!-- ── CTA ── -->
        <tr>
          <td style="background:white;padding:0 40px 36px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;padding:0;">
                <a href="https://subflow-three.vercel.app/dashboard/conformite"
                  style="display:inline-block;padding:14px 28px;color:white;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:-0.2px;">
                  Gérer la conformité →
                </a>
              </td>
            </tr></table>
            <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;line-height:1.6;">
              Vous recevez cet email car votre compte SubFlow (<strong>${userEmail}</strong>) a des documents dont la date d'expiration approche ou est dépassée.
            </p>
          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#f8fafc;border-radius:0 0 20px 20px;padding:20px 40px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;">
              © ${new Date().getFullYear()} SubFlow · Plateforme de gestion des sous-traitants
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── Route handler ───────────────────────────────────── */

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  // Documents expirés ou expirant dans les 30 prochains jours
  const in30Days = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  const { data: docs, error: dbError } = await supabase
    .from("documents")
    .select("id, nom, type_document, date_expiration, sous_traitants(nom)")
    .eq("user_id", user.id)
    .not("date_expiration", "is", null)
    .lte("date_expiration", in30Days)
    .order("date_expiration", { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  if (!docs || docs.length === 0) {
    return NextResponse.json({
      message: "Aucun document expiré ou expirant bientôt. Tout est en ordre !",
      sent: false,
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const count = docs.length;

  const { error: emailError } = await resend.emails.send({
    from: "SubFlow Alertes <onboarding@resend.dev>",
    to: user.email,
    subject: `⚠️ ${count} document${count > 1 ? "s" : ""} à vérifier — SubFlow`,
    html: buildEmailHtml(docs as unknown as DocRow[], user.email),
  });

  if (emailError) {
    return NextResponse.json({ error: emailError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: `Email envoyé à ${user.email} — ${count} document${count > 1 ? "s" : ""} signalé${count > 1 ? "s" : ""}.`,
    sent: true,
    count,
  });
}
