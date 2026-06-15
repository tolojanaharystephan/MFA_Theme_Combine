import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MFA Decision Platform",
  description: "Systeme intelligent d'aide a la decision pour ressources et operations militaires"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

