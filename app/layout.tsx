import type { Metadata } from "next";
import "./globals.css";
import "./admin.css";
import "./enhancements.css";
import "./video.css";
import "./footer-bar.css";
import "./simulator-refresh.css";
import "./catalog-refresh.css";

export const metadata: Metadata = {
  title: "Kwako Nyumbani — Programme logement RUASHI MINING",
  description: "Découvrez, simulez et réservez votre maison EPANAYO dans le cadre du programme Kwako Nyumbani.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
