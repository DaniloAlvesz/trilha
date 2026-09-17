"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNavigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Hoje" },
    { href: "/agenda", label: "Minhas consultas" },
    { href: "/diario", label: "Meu diário" },
    { href: "/fotos", label: "Fotos e evolução" },
    { href: "/comunidade", label: "Papo privado" },
    { href: "/relatorio-print", label: "Relatório para consulta" },
  ];

  return (
    <header className="w-full bg-clinical-action text-white border-b-2 border-clinical-ink/20 shadow-sm no-print">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-3.5 border-b border-white/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <span className="font-sans text-xs sm:text-sm tracking-wide block text-white/90">
              Seu espaço seguro de acompanhamento e cuidado contínuo
            </span>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-0.5">
              Trilha • Cuidado Oncológico
            </h1>
          </div>
          <div className="rounded-lg border border-white/30 px-3 py-1.5 bg-clinical-ink/80 text-white font-mono text-xs sm:text-sm self-start md:self-auto shrink-0 shadow-sm">
            Código anônimo: BR-9482
          </div>
        </div>
      </div>

      {/* Navegação Primária Acolhedora */}
      <nav className="w-full max-w-7xl mx-auto px-3 py-2 overflow-x-auto no-scrollbar" aria-label="Navegação Principal">
        <ul className="flex flex-nowrap md:flex-wrap gap-1.5 sm:gap-2 min-w-max md:min-w-0">
          {links.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="flex-shrink-0">
                <Link
                  href={item.href}
                  className={`min-h-[44px] sm:min-h-[46px] px-3.5 sm:px-4.5 rounded-lg inline-flex items-center justify-center font-sans text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? "bg-clinical-paper text-clinical-ink shadow-sm font-bold"
                      : "bg-white/10 text-white hover:bg-clinical-paper/90 hover:text-clinical-ink focus:bg-clinical-paper focus:text-clinical-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
