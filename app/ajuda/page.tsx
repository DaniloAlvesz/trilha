import Link from "next/link";
import Icon from "@/components/Icon";
const links = [
  {
    href: "/relatorio-print",
    icon: "diary",
    title: "Preparar minha consulta",
    text: "Guarde dúvidas e leve seus registros.",
  },
  {
    href: "/ajustes",
    icon: "settings",
    title: "Seus dados e preferências",
    text: "Texto maior, lembretes e armazenamento.",
  },
  {
    href: "/comunidade",
    icon: "users",
    title: "Fórum anônimo",
    text: "Conheça as conversas e participe por apelido.",
  },
  {
    href: "/aprender",
    icon: "book",
    title: "Orientações de saúde",
    text: "Textos simples e fontes para consultar.",
  },
  {
    href: "/fotos",
    icon: "camera",
    title: "Meus registros em fotos",
    text: "Um recurso opcional. Não avalia sua saúde.",
  },
];
export default function Help() {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <h1>Mais opções e ajuda</h1>
          <p>Encontre o que precisa, com calma e sem complicação.</p>
        </div>
      </div>
      <div className="two-columns">
        {links.map((l) => (
          <Link className="card feature-link" href={l.href} key={l.href}>
            <span className="icon-tile">
              <Icon name={l.icon} />
            </span>
            <span>
              <strong>{l.title}</strong>
              <span>{l.text}</span>
            </span>
            <Icon name="arrow" />
          </Link>
        ))}
      </div>
      <section className="card">
        <h2>Como usar o ONCO+</h2>
        <details open>
          <summary>Por onde eu começo?</summary>
          <p>1. Toque em “Diário”.</p>
          <p>2. Escolha como estão suas emoções e seu corpo.</p>
          <p>3. Toque em “Salvar meu registro”.</p>
          <p>Depois, vá a “Agenda” para guardar a data da próxima consulta.</p>
        </details>
        <details>
          <summary>Preciso usar todos os dias?</summary>
          <p>
            Você pode fazer uma pausa breve por dia, se isso ajudar. Não há
            pontos, cobrança ou punição por dias sem registro. Combine a
            frequência de acompanhamento com sua equipe.
          </p>
        </details>
        <details>
          <summary>Alguém recebe meus registros?</summary>
          <p>
            Não. Este protótipo não envia seus registros para profissionais nem
            avisa uma equipe de saúde. Você pode salvar um resumo e compartilhar
            por sua própria escolha.
          </p>
        </details>
        <details>
          <summary>Meus registros sumiram. O que aconteceu?</summary>
          <p>
            Por padrão, eles ficam só na aba aberta. Em “Seus dados e
            preferências”, você pode permitir que fiquem neste navegador. Trocar
            de aparelho, navegar em modo privado ou limpar o navegador pode
            fazer os dados desaparecerem.
          </p>
        </details>
        <details>
          <summary>O aplicativo serve para homens também?</summary>
          <p>
            Sim. O ONCO+ é destinado a pessoas com câncer de mama, incluindo
            homens e mulheres. Sintomas, tratamentos e necessidades são
            individuais. O aplicativo não define o cuidado com base no gênero.
          </p>
        </details>
      </section>
      <section className="card">
        <h2>Preciso de ajuda de saúde agora</h2>
        <p>
          Este aplicativo não é um canal de urgência. Entre em contato com seu
          serviço de saúde se tiver sintomas novos, piora ou dúvidas sobre o
          tratamento.
        </p>
        <p>
          Em uma emergência, ligue <a href="tel:192">192 — SAMU</a>. Para apoio
          emocional, o <a href="https://cvv.org.br/">CVV</a> atende pelo{" "}
          <a href="tel:188">188</a>. O CVV não substitui um atendimento de
          emergência.
        </p>
      </section>
    </div>
  );
}
