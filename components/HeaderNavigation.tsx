"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useCare } from "./CareProvider";
const tabs = [
  { href: "/", label: "Hoje", icon: "home" },
  { href: "/diario", label: "Diário", icon: "diary" },
  { href: "/agenda", label: "Agenda", icon: "calendar" },
  { href: "/comunidade", label: "Fórum", icon: "users" },
];
export default function HeaderNavigation() {
  const pathname = usePathname();
  const { data, update, message, notify } = useCare();
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
              <small>Seu cuidado, mais perto</small>
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
            <Link
              className="help-link"
              href="/ajuda"
              aria-label="Mais opções e ajuda"
            >
              <Icon name="help" />
              <span>Mais</span>
            </Link>
          </div>
        </div>
      </header>
      <nav className="main-nav no-print" aria-label="Navegação principal">
        <div>
          {tabs.map((t) => {
            const active = pathname === t.href;
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
