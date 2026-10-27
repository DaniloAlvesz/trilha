"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useCare } from "./CareProvider";
const tabs = [
  { href: "/", label: "Hoje", icon: "home" },
  { href: "/diario", label: "Diário", icon: "diary" },
  { href: "/agenda", label: "Agenda", icon: "calendar" },
  { href: "/aprender", label: "Orientações", icon: "book" },
  { href: "/ajuda", label: "Mais", icon: "more" },
];
export default function HeaderNavigation() {
  const pathname = usePathname();
  const { data, update, message, notify } = useCare();
  const extra = [
    "/ajuda",
    "/ajustes",
    "/fotos",
    "/comunidade",
    "/relatorio-print",
  ];
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <header className="site-header no-print">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="ONCO+ — página inicial">
            <span className="brand-mark">
              <Icon name="plus" />
            </span>
            <span>
              ONCO<span className="brand-plus">+</span>
              <small>Cuidado que acompanha você</small>
            </span>
          </Link>
          <div className="header-actions">
            <button
              className="text-button"
              aria-label={
                data.largeText
                  ? "Usar tamanho padrão do texto"
                  : "Aumentar tamanho do texto"
              }
              aria-pressed={data.largeText}
              onClick={() => update((d) => ({ ...d, largeText: !d.largeText }))}
            >
              A<span aria-hidden="true">+</span>
              <span className="font-label">
                {" "}
                {data.largeText ? "Texto padrão" : "Aumentar texto"}
              </span>
            </button>
            <Link className="help-link" href="/ajuda" aria-label="Ajuda">
              <Icon name="help" />
              <span>Ajuda</span>
            </Link>
          </div>
        </div>
      </header>
      <nav className="main-nav no-print" aria-label="Navegação principal">
        <div>
          {tabs.map((t) => {
            const active =
              t.href === "/ajuda"
                ? extra.includes(pathname)
                : pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={t.icon} />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      {message && (
        <div className="notice no-print" role="status">
          <span>{message}</span>
          <button aria-label="Fechar mensagem" onClick={() => notify("")}>
            ×
          </button>
        </div>
      )}
    </>
  );
}
