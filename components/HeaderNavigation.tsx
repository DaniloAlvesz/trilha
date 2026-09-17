"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNavigation() {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/",
      label: "Início",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform ${active ? "scale-110" : ""}`}
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? "2" : "1.8"}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      href: "/diario",
      label: "Diário",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform ${active ? "scale-110" : ""}`}
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? "2" : "1.8"}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      href: "/fotos",
      label: "Evolução",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform ${active ? "scale-110" : ""}`}
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? "2" : "1.8"}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      href: "/comunidade",
      label: "Comunidade",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform ${active ? "scale-110" : ""}`}
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? "2" : "1.8"}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Top Header Acolhedor & Limpo */}
      <header className="w-full bg-clinical-action text-white shadow-sm no-print sticky top-0 z-30">
        <div className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-lg shadow-inner group-hover:scale-105 transition-transform">
              🌸
            </span>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white block leading-tight">
                Trilha
              </span>
              <span className="font-sans text-[11px] sm:text-xs text-white/80 block">
                Cuidado contínuo e acolhimento
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/agenda"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-semibold transition-colors"
            >
              📅 Minhas Consultas
            </Link>
            <div className="rounded-full bg-clinical-ink/70 px-3 py-1 text-white/90 text-xs font-mono">
              BR-9482
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Tab Bar Ergonômica (Thumb Zone) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-clinical-surface/30 shadow-[0_-4px_20px_rgba(42,17,26,0.06)] no-print pb-safe"
        aria-label="Navegação Principal Móvel"
      >
        <div className="w-full max-w-md mx-auto grid grid-cols-4 px-2 py-1">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`min-h-[52px] min-w-[48px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 py-1.5 px-1 select-none active:scale-95 ${
                  isActive
                    ? "text-clinical-action bg-clinical-surface/15 font-bold"
                    : "text-clinical-ink/65 hover:text-clinical-ink font-medium"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.icon(Boolean(isActive))}
                <span className="text-[11px] leading-none tracking-tight">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
