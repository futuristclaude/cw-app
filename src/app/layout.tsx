import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cowork — Реестры сделок",
  description: "Управление сделками: приём, закупка, договор, поставка",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body>{children}</body>
    </html>
  );
}
