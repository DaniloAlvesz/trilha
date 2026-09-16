import type { Metadata, Viewport } from "next";
import "./globals.css";
import HeaderNavigation from "@/components/HeaderNavigation";

export const metadata: Metadata = {
  title: "TRILHA // CADERNETA CLÍNICA ONCOLÓGICA",
  description: "Infraestrutura digital de acompanhamento clínico, logístico e emocional de sobrevivência oncológica.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#F4F4EB] text-black antialiased selection:bg-black selection:text-[#F4F4EB]">
        <HeaderNavigation />
        <main className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
        <footer className="w-full border-t-4 border-black bg-[#1A4331] text-[#F4F4EB] p-3 sm:p-4 mt-8 sm:mt-12 no-print font-mono text-[11px] sm:text-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2 break-words">
            <div>
              PADRÃO DOCUMENTAL: BRUTALISMO CLÍNICO // HL7 FHIR RELEASE 4 COMPLIANT
            </div>
            <div>
              CRIPTOGRAFIA UNIDIRECIONAL ATIVA // DADOS REAIS DE MUNDO (RWD)
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
