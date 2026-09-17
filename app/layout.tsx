import type { Metadata, Viewport } from "next";
import "./globals.css";
import HeaderNavigation from "@/components/HeaderNavigation";

export const metadata: Metadata = {
  title: "Trilha • Cuidado Oncológico Humanizado",
  description: "Acompanhamento acolhedor, logístico e emocional para a sua jornada de saúde.",
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
      <body className="min-h-screen bg-clinical-paper text-clinical-ink antialiased selection:bg-clinical-ink selection:text-clinical-paper">
        <HeaderNavigation />
        <main className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
        <footer className="w-full border-t border-clinical-surface/40 bg-clinical-action text-white p-4 sm:p-6 mt-8 sm:mt-12 no-print text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
            <p className="font-medium">
              Trilha • Cuidado contínuo, seguro e dedicado à sua saúde e bem-estar.
            </p>
            <p className="text-white/80 text-xs">
              Seus dados estão protegidos com total privacidade e acolhimento.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
