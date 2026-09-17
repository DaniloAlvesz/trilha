"use client";

import React, { useState, useEffect } from "react";
import { CommunityThread, CommunityReply } from "@/types/clinical";

// Regex de Sanitização Prévia Médica (Anti-Automedicação e Terapias de Risco)
const REGEX_RESTRICOES_MEDICAS = /(dobrar dose|interromper tratamento|parar de tomar|cloroquina|ozonioterapia|cura milagrosa|ch[aá] milagroso|substituir rem[eé]dio|receita falsa|venda de rem[eé]dio)/i;

export default function PapoPrivadoPage() {
  const [meuAliasBotanico] = useState("JACARANDA-892");
  const [salaAtiva, setSalaAtiva] = useState<CommunityThread["category"]>("HORMONIOTERAPIA");

  const [threads, setThreads] = useState<CommunityThread[]>([
    {
      id: "thread-01",
      category: "HORMONIOTERAPIA",
      authorBotanyAlias: "BROMELIA-304",
      title: "ONDA DE CALOR (FOGACHO) NO PERÍODO DA MADRUGADA COM TAMOXIFENO",
      body: "Iniciei o segundo mês e os fogachos me acordam toda madrugada às 3h. Meu oncologista sugeriu mudança no horário da tomada para as manhãs. Alguém ajustou o relógio biológico com sucesso?",
      createdAt: "2026-09-10T22:15:00-03:00",
      replyCount: 2,
    },
    {
      id: "thread-02",
      category: "LINFEDEMA",
      authorBotanyAlias: "IPE-ROXO-112",
      title: "USO DA BRAÇADEIRA COMPRESSIVA EM VOOS DOMÉSTICOS",
      body: "Passando para registrar que a fisioterapeuta recomendou a luva/braçadeira de compressão elástica durante o voo por conta da pressurização da cabine. Não tive edema após o pouso.",
      createdAt: "2026-09-09T18:40:00-03:00",
      replyCount: 1,
    },
    {
      id: "thread-03",
      category: "EMOCIONAL",
      authorBotanyAlias: "EMBAUBA-405",
      title: "O SILÊNCIO APÓS O ÚLTIMO DIA DE RADIOTERAPIA",
      body: "A transição de ir ao hospital todos os dias para voltar para casa sem consultas semanais gerou um vazio esquisito. A sensação de abandono da rotina médica é real. Como vocês lidaram no primeiro mês?",
      createdAt: "2026-09-08T11:00:00-03:00",
      replyCount: 3,
    },
  ]);

  const [respostas, setRespostas] = useState<Record<string, CommunityReply[]>>({
    "thread-01": [
      {
        id: "rep-01",
        threadId: "thread-01",
        authorBotanyAlias: "JACARANDA-892",
        body: "Mudei o horário para as 08h00 da manhã após autorização expressa do meu médico. As ondas de calor diminuíram sensivelmente durante o sono.",
        createdAt: "2026-09-10T23:00:00-03:00",
      },
      {
        id: "rep-02",
        threadId: "thread-01",
        authorBotanyAlias: "SAMAMBAIA-714",
        body: "O uso de leques e roupas 100% algodão no quarto também ajudou a diminuir os despertares noturnos.",
        createdAt: "2026-09-11T00:30:00-03:00",
      },
    ],
  });

  const [threadSelecionadaId, setThreadSelecionadaId] = useState<string | null>("thread-01");
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTexto, setNovoTexto] = useState("");
  const [novaRespostaTexto, setNovaRespostaTexto] = useState("");
  const [pollingStatus, setPollingStatus] = useState("[LONG POLLING: SINCRONIZADO (15S)]");
  const [alertaSeguranca, setAlertaSeguranca] = useState<string | null>(null);

  // Long polling simulation (15 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setPollingStatus(`[LONG POLLING: SINC ÀS ${new Date().toLocaleTimeString("pt-BR")}]`);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Post de Novo Tópico com Middleware RegEx de Segurança
  const handleCriarTopico = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertaSeguranca(null);

    const conteudoCompleto = `${novoTitulo} ${novoTexto}`;
    if (REGEX_RESTRICOES_MEDICAS.test(conteudoCompleto)) {
      setAlertaSeguranca(
        "[EXCEÇÃO 403: PUBLICAÇÃO BARRADA PELO MIDDLEWARE DE SANITIZAÇÃO CLÍNICA. IDENTIFICADOS TERMOS DE RISCO OU SUGESTÃO DE ALTERAÇÃO DE CONDUTA FARMACOLÓGICA NÃO AUTORIZADA]"
      );
      return;
    }

    if (!novoTitulo.trim() || !novoTexto.trim()) {
      setAlertaSeguranca("[ERRO: TÍTULO E CORPO DO TÓPICO SÃO OBRIGATÓRIOS]");
      return;
    }

    const nova: CommunityThread = {
      id: `thread-${Date.now()}`,
      category: salaAtiva,
      authorBotanyAlias: meuAliasBotanico,
      title: novoTitulo.trim().toUpperCase(),
      body: novoTexto.trim(),
      createdAt: new Date().toISOString(),
      replyCount: 0,
    };

    setThreads([nova, ...threads]);
    setNovoTitulo("");
    setNovoTexto("");
    setAlertaSeguranca(null);
    setPollingStatus("[REGISTRO ARQUIVADO: TÓPICO DISPONÍVEL NA SALA TEMÁTICA]");
  };

  // Envio de Resposta
  const handleEnviarResposta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadSelecionadaId) return;

    if (REGEX_RESTRICOES_MEDICAS.test(novaRespostaTexto)) {
      setAlertaSeguranca(
        "[EXCEÇÃO 403: RESPOSTA RECUSADA PELO MIDDLEWARE DE SEGURANÇA FARMACOLÓGICA. RISCO DETECTADO]"
      );
      return;
    }

    if (!novaRespostaTexto.trim()) return;

    const novaRep: CommunityReply = {
      id: `rep-${Date.now()}`,
      threadId: threadSelecionadaId,
      authorBotanyAlias: meuAliasBotanico,
      body: novaRespostaTexto.trim(),
      createdAt: new Date().toISOString(),
    };

    const listaAtual = respostas[threadSelecionadaId] || [];
    setRespostas({
      ...respostas,
      [threadSelecionadaId]: [...listaAtual, novaRep],
    });

    setThreads(
      threads.map((t) =>
        t.id === threadSelecionadaId ? { ...t, replyCount: t.replyCount + 1 } : t
      )
    );

    setNovaRespostaTexto("");
    setAlertaSeguranca(null);
    setPollingStatus("[REGISTRO ARQUIVADO: RESPOSTA LINEAR INSERIDA]");
  };

  const threadsDaSala = threads.filter((t) => t.category === salaAtiva);
  const threadAtual = threads.find((t) => t.id === threadSelecionadaId);
  const respostasAtuais = threadSelecionadaId ? respostas[threadSelecionadaId] || [] : [];

  // Mapeamento de nomes amigáveis para as salas
  const salasNomes: Record<CommunityThread["category"], string> = {
    HORMONIOTERAPIA: "Hormonioterapia",
    LINFEDEMA: "Linfedema e Cuidados",
    RECONSTRUCAO: "Reconstrução",
    EMOCIONAL: "Apoio Emocional",
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho Acolhedor */}
      <section className="bg-clinical-paper border border-clinical-ink/20 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <span className="font-sans text-xs sm:text-sm font-semibold text-clinical-action block">
              Comunidade anônima de apoio mútuo
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clinical-ink mt-0.5">
              Papo Privado entre Mulheres
            </h1>
          </div>
          <div className="rounded-xl border border-clinical-ink/20 bg-white text-clinical-ink px-3.5 py-1.5 font-sans text-xs sm:text-sm font-medium self-start md:self-auto shrink-0 shadow-sm flex items-center gap-2">
            <span>🌸 Seu apelido anônimo:</span>
            <span className="text-clinical-action font-bold">{meuAliasBotanico}</span>
          </div>
        </div>
        <p className="font-sans text-sm sm:text-base text-clinical-ink/80 mt-2 leading-relaxed">
          Um espaço seguro para trocar experiências reais sobre o dia a dia do tratamento. Para preservar sua privacidade total, todas nós conversamos usando nomes botânicos protegidos, sem fotos e sem julgamentos.
        </p>
      </section>

      {/* Alerta de Segurança / Sanitização Regex Empático */}
      {alertaSeguranca && (
        <div
          role="alert"
          className="rounded-2xl border border-clinical-alert/30 bg-clinical-alert text-white p-4 sm:p-5 font-sans text-xs sm:text-sm font-medium shadow-md leading-relaxed"
        >
          {alertaSeguranca}
        </div>
      )}

      {/* Seleção de Salas Temáticas com Cantos Suaves */}
      <section className="flex flex-wrap gap-2 items-center">
        <span className="font-sans text-xs sm:text-sm font-bold text-clinical-ink w-full sm:w-auto mb-1 sm:mb-0">
          Salas de conversa:
        </span>
        {(["HORMONIOTERAPIA", "LINFEDEMA", "RECONSTRUCAO", "EMOCIONAL"] as const).map((sala) => (
          <button
            key={sala}
            type="button"
            onClick={() => {
              setSalaAtiva(sala);
              setThreadSelecionadaId(null);
            }}
            className={`min-h-[44px] px-4 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              salaAtiva === sala
                ? "bg-clinical-action text-white shadow-sm"
                : "bg-white text-clinical-ink border border-clinical-ink/20 hover:bg-clinical-paper"
            }`}
          >
            {salasNomes[sala]}
          </button>
        ))}
      </section>

      {/* Layout Split em Cards com Respiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1: Lista de Tópicos e Formulário */}
        <div className="space-y-6">
          {/* Formulário de Novo Tópico */}
          <section className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-clinical-ink border-b border-clinical-ink/15 pb-2">
              Iniciar conversa em {salasNomes[salaAtiva]}
            </h2>
            <form onSubmit={handleCriarTopico} className="space-y-3.5">
              <div>
                <label htmlFor="topico-titulo" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                  Título da sua dúvida ou relato:
                </label>
                <input
                  id="topico-titulo"
                  type="text"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="Ex: Como vocês lidam com as ondas de calor?"
                  className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="topico-corpo" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                  Escreva seu relato ou pergunta (evite colocar dados pessoais):
                </label>
                <textarea
                  id="topico-corpo"
                  value={novoTexto}
                  onChange={(e) => setNovoTexto(e.target.value)}
                  placeholder="Compartilhe como você está se sentindo ou o que gostaria de saber..."
                  className="w-full min-h-[96px] p-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-ink transition-all shadow-sm text-center"
              >
                Publicar com meu apelido anônimo
              </button>
            </form>
          </section>

          {/* Lista de Tópicos da Sala */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-clinical-ink">
              Conversas recentes nesta sala
            </h2>
            {threadsDaSala.length === 0 ? (
              <div className="rounded-2xl border border-clinical-ink/20 p-6 bg-white font-sans text-sm sm:text-base text-center text-clinical-ink/70 shadow-sm">
                Ainda não há conversas nesta sala. Que tal ser a primeira a compartilhar?
              </div>
            ) : (
              threadsDaSala.map((t) => (
                <article
                  key={t.id}
                  onClick={() => {
                    setThreadSelecionadaId(t.id);
                    if (window.innerWidth < 1024) {
                      document.getElementById("painel-conversa")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all shadow-sm ${
                    threadSelecionadaId === t.id
                      ? "border-clinical-action bg-clinical-paper ring-2 ring-clinical-action/20"
                      : "border-clinical-ink/20 bg-white hover:border-clinical-action/40"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 border-b border-clinical-ink/10 pb-2 mb-2.5 font-sans text-xs font-semibold text-clinical-ink/70">
                    <span className="text-clinical-action">🌸 {t.authorBotanyAlias}</span>
                    <span className="rounded-full bg-clinical-paper px-2.5 py-0.5 border border-clinical-ink/10">
                      {t.replyCount} {t.replyCount === 1 ? "resposta" : "respostas"}
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-clinical-ink mb-1 break-words">
                    {t.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-clinical-ink/80 line-clamp-2 break-words leading-relaxed">
                    {t.body}
                  </p>
                </article>
              ))
            )}
          </section>
        </div>

        {/* Coluna 2: Tópico Aberto e Respostas com Respiro Acolhedor */}
        <div id="painel-conversa">
          {threadAtual ? (
            <div className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="border-b border-clinical-ink/15 pb-4">
                <div className="flex justify-between items-center font-sans text-xs text-clinical-ink/70 mb-2">
                  <span className="font-bold text-clinical-action">🌸 Publicado por {threadAtual.authorBotanyAlias}</span>
                  <span className="rounded-full bg-clinical-paper px-2.5 py-0.5 border border-clinical-ink/10 font-medium">
                    {salasNomes[threadAtual.category]}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink break-words">
                  {threadAtual.title}
                </h2>
                <p className="font-sans text-sm sm:text-base mt-2.5 text-clinical-ink/90 leading-relaxed break-words">
                  {threadAtual.body}
                </p>
              </div>

              {/* Lista de Respostas */}
              <div className="space-y-3">
                <h3 className="font-serif text-base sm:text-lg font-bold text-clinical-ink">
                  Respostas e acolhimento ({respostasAtuais.length})
                </h3>

                {respostasAtuais.length === 0 ? (
                  <div className="p-4 rounded-xl bg-clinical-paper font-sans text-xs sm:text-sm text-clinical-ink/70">
                    Ainda não há respostas nesta conversa. Escreva uma palavra de carinho ou compartilhe como você lida com isso!
                  </div>
                ) : (
                  respostasAtuais.map((rep) => (
                    <div key={rep.id} className="rounded-xl border border-clinical-ink/15 p-3.5 bg-clinical-paper space-y-1.5 shadow-sm">
                      <div className="font-sans text-xs font-bold text-clinical-action">
                        🌸 {rep.authorBotanyAlias}
                      </div>
                      <p className="font-sans text-sm sm:text-base text-clinical-ink leading-relaxed break-words">
                        {rep.body}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Formulário de Resposta */}
              <form onSubmit={handleEnviarResposta} className="pt-3 border-t border-clinical-ink/15 space-y-3">
                <label htmlFor="resp-corpo" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink">
                  Sua resposta de apoio ({meuAliasBotanico}):
                </label>
                <textarea
                  id="resp-corpo"
                  value={novaRespostaTexto}
                  onChange={(e) => setNovaRespostaTexto(e.target.value)}
                  placeholder="Escreva sua experiência ou uma mensagem acolhedora..."
                  className="w-full min-h-[80px] p-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] px-6 rounded-xl bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-ink transition-all shadow-sm text-center"
                >
                  Enviar resposta acolhedora
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-clinical-ink/20 p-8 sm:p-10 bg-white text-center font-sans text-sm sm:text-base text-clinical-ink/70 shadow-sm">
              👈 Selecione uma conversa na coluna ao lado para ler e participar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
