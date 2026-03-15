import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubFlow – Gestion de sous-traitants",
  description: "La plateforme SaaS pour gérer vos sous-traitants en toute conformité.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
