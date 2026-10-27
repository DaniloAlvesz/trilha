import Link from "next/link";
const cards = [
  {
    title: "Depois do tratamento, o cuidado continua",
    body: "A frequência das consultas e os exames dependem da sua história e do tratamento recebido. Guarde as orientações da sua equipe. O ONCO+ não cria um calendário médico para você.",
    source: "INCA · Câncer de mama",
    url: "https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/mama",
  },
  {
    title: "Câncer de mama também pode acontecer em homens",
    body: "Homens e mulheres podem precisar de acompanhamento, apoio emocional e ajuda com efeitos do tratamento. Cada pessoa tem necessidades próprias. Converse também sobre sexualidade, imagem corporal e dúvidas que pareçam difíceis de falar.",
    source: "National Cancer Institute · Câncer de mama em homens (em inglês)",
    url: "https://www.cancer.gov/types/breast/male-breast-cancer",
  },
  {
    title: "Medicamento: registre, sem se cobrar",
    body: "Se você usa medicamento contínuo, siga a prescrição. Se houve esquecimento, efeitos indesejados ou dificuldade para conseguir o remédio, converse com a equipe. O aplicativo não orienta compensar doses nem mudar horários.",
    source: "National Cancer Institute · Terapia hormonal (em inglês)",
    url: "https://www.cancer.gov/types/breast/breast-hormone-therapy-fact-sheet",
  },
  {
    title: "Uma dúvida anotada pode ajudar na consulta",
    body: "Antes da consulta, pense no que mudou no seu corpo e no seu dia a dia. Escreva o que mais preocupa você. Se não entender a resposta, peça para a equipe explicar de outro jeito.",
    source: "National Cancer Institute · Perguntas sobre o câncer (em inglês)",
    url: "https://www.cancer.gov/about-cancer/coping/questions",
  },
  {
    title: "Informações da internet precisam de cuidado",
    body: "Confira quem publicou, quando o conteúdo foi atualizado e quais fontes foram usadas. Um relato pessoal pode oferecer acolhimento, mas não indica qual tratamento serve para você.",
    source: "INCA · Informações sobre câncer",
    url: "https://www.gov.br/inca/pt-br/assuntos/cancer",
  },
];
export default function Learn() {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">INFORMAÇÃO COM CLAREZA</p>
          <h1>Orientações para o seu cuidado</h1>
          <p>Textos curtos para apoiar suas conversas com a equipe de saúde.</p>
        </div>
      </div>
      <p className="info-note">
        Conteúdo educativo geral, organizado para este protótipo. Não substitui
        orientações individuais. As fontes estão disponíveis em cada cartão;
        algumas são em inglês.
      </p>
      <div className="article-grid">
        {cards.map((c) => (
          <article className="card" key={c.title}>
            <h2>{c.title}</h2>
            <p>{c.body}</p>
            <a href={c.url}>{c.source} ↗</a>
          </article>
        ))}
      </div>
      <Link className="button" href="/relatorio-print">
        Guardar uma dúvida para minha consulta
      </Link>
    </div>
  );
}
