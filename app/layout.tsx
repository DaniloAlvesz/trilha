import type { Metadata, Viewport } from "next";
import "./globals.css";
import HeaderNavigation from "@/components/HeaderNavigation";
import { CareProvider } from "@/components/CareProvider";
import Link from "next/link";
export const metadata: Metadata = {
  title: {
    default: "ONCO+ | Seu cuidado, um dia de cada vez",
    template: "%s | ONCO+",
  },
  description:
    "Agenda, diário e preparação para consultas de pessoas com câncer de mama. Um protótipo simples e inclusivo de apoio ao cuidado.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#123d3a",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CareProvider>
          <HeaderNavigation />
          <main id="conteudo" tabIndex={-1}>
            {children}
          </main>
          <footer className="site-footer no-print">
            <strong>ONCO+</strong>
            <p>
              Protótipo de apoio ao cuidado. Não há equipe acompanhando os
              registros.
            </p>
            <Link href="/ajustes">Seus dados e preferências</Link>
          </footer>
        </CareProvider>
      </body>
    </html>
  );
}
