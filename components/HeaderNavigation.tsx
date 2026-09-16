"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNavigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "HOJE" },
    { href: "/agenda", label: "MINHA AGENDA" },
    { href: "/diario", label: "MEU DIÁRIO" },
    { href: "/fotos", label: "LINHA DO TEMPO" },
    { href: "/comunidade", label: "PAPO PRIVADO" },
    { href: "/relatorio-print", label: "IMPRIMIR RELATÓRIO" },
  ];

  return (
    <header className="w-full bg-[#1A4331] text-[#F4F4EB] border-b-4 border-black no-print">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 border-[#F4F4EB]/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase block text-[#F4F4EB]/80">
              SISTEMA NACIONAL DE SOBREVIDA ONCOLÓGICA • PROTOCOLO TRILHA
            </span>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[#F4F4EB]">
              TRILHA // CADERNETA CLÍNICA
            </h1>
          </div>
          <div className="border border-[#F4F4EB] px-2.5 py-1 bg-black text-[#F4F4EB] font-mono text-xs sm:text-sm uppercase self-start md:self-auto shrink-0">
            REGISTRO: BR-ONCO-9482-SUS
          </div>
        </div>
      </div>

      {/* Navegação Primária em Texto Puro - Rolagem horizontal sem quebra forçada no mobile */}
      <nav className="w-full max-w-7xl mx-auto px-2 overflow-x-auto no-scrollbar" aria-label="Navegação Principal">
        <ul className="flex flex-nowrap md:flex-wrap gap-1 py-1.5 min-w-max md:min-w-0">
          {links.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="flex-shrink-0">
                <Link
                  href={item.href}
                  className={`min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 inline-flex items-center justify-center font-mono text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider whitespace-nowrap border-2 border-black transition-none ${
                    isActive
                      ? "bg-[#F4F4EB] text-black border-black"
                      : "bg-[#1A4331] text-[#F4F4EB] hover:bg-[#F4F4EB] hover:text-[#1A4331] focus:bg-[#F4F4EB] focus:text-[#1A4331]"
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
