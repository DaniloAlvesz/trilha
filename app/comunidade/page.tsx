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

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="border-b-4 border-black pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <span className="font-mono text-[10px] sm:text-xs uppercase font-bold text-[#1A4331] block">
              MÓDULO DE SUPORTE ENTRE PARES // DESACOPLAMENTO TOTAL DE PRONTUÁRIO
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-black uppercase break-words">
              PAPO PRIVADO // COMUNIDADE ANÔNIMA
            </h1>
          </div>
          <div className="border-2 border-black bg-black text-[#F4F4EB] p-2 font-mono text-xs sm:text-sm uppercase self-start md:self-auto shrink-0">
            SEU ALIAS BOTÂNICO: <span className="text-[#B8860B] font-bold">{meuAliasBotanico}</span>
          </div>
        </div>
        <p className="font-mono text-xs sm:text-sm uppercase text-black font-bold mt-1 break-words">
          REDE LINEAR SEM ALGORITMOS DE RECOMENDAÇÃO, SEM BOTÕES DE CURTIR E SEM FOTOS DE PERFIL
        </p>
      </section>

      {/* Status Bar */}
      <div className="border-2 border-black bg-black text-[#F4F4EB] p-2.5 sm:p-3 font-mono text-xs sm:text-sm uppercase flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
        <span>ESTADO DA REDE:</span>
        <span className="text-[#B8860B] font-bold break-words">{pollingStatus}</span>
      </div>

      {/* Alerta de Segurança / Sanitização Regex */}
      {alertaSeguranca && (
        <div
          role="alert"
          className="border-4 border-black bg-[#7C2D3A] text-[#F4F4EB] p-3 sm:p-4 font-mono text-xs sm:text-sm font-bold uppercase break-words"
        >
          {alertaSeguranca}
        </div>
      )}

      {/* Seleção de Salas Temáticas Pré-Aprovadas (48px Min Target) */}
      <section className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
        <span className="font-mono text-xs sm:text-sm font-black uppercase w-full sm:w-auto mb-1 sm:mb-0">
          SALA TEMÁTICA:
        </span>
        {(["HORMONIOTERAPIA", "LINFEDEMA", "RECONSTRUCAO", "EMOCIONAL"] as const).map((sala) => (
          <button
            key={sala}
            type="button"
            onClick={() => {
              setSalaAtiva(sala);
              setThreadSelecionadaId(null);
            }}
            className={`flex-1 sm:flex-none min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 font-mono text-xs sm:text-sm font-black uppercase border-2 border-black transition-none text-center ${
              salaAtiva === sala
                ? "bg-black text-[#F4F4EB]"
                : "bg-[#F4F4EB] text-black hover:bg-black hover:text-[#F4F4EB]"
            }`}
          >
            {sala}
          </button>
        ))}
      </section>

      {/* Layout Split: Tópicos e Respostas (Zero Z-Axis) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1: Lista de Tópicos e Formulário */}
        <div className="space-y-6">
          {/* Formulário de Novo Tópico */}
          <section className="border-2 border-black bg-white p-3.5 sm:p-4 space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-black uppercase border-b-2 border-black pb-1 break-words">
              CRIAR NOVO TÓPICO NA SALA: {salaAtiva}
            </h2>
            <form onSubmit={handleCriarTopico} className="space-y-3">
              <div>
                <label htmlFor="topico-titulo" className="block font-mono text-xs font-bold uppercase mb-1">
                  TÍTULO DO TÓPICO (OBJETIVO E CLARO):
                </label>
                <input
                  id="topico-titulo"
                  type="text"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="EX: MANEJO DE DORES ARTICULARES COM ANASTROZOL"
                  className="w-full min-h-[48px] px-3 border-2 border-black font-mono text-sm sm:text-base bg-[#F4F4EB] text-black focus:outline-none focus:bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="topico-corpo" className="block font-mono text-xs font-bold uppercase mb-1">
                  CONTEÚDO DO TÓPICO (SEM IDENTIFICAÇÃO PESSOAL OU NOMES REAIS):
                </label>
                <textarea
                  id="topico-corpo"
                  value={novoTexto}
                  onChange={(e) => setNovoTexto(e.target.value)}
                  placeholder="DIGITE SEU RELATO OU DÚVIDA LOGÍSTICA..."
                  className="w-full min-h-[96px] p-3 border-2 border-black font-mono text-sm sm:text-base bg-[#F4F4EB] text-black focus:outline-none focus:bg-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-6 bg-[#1A4331] text-[#F4F4EB] font-mono text-xs sm:text-sm font-black uppercase border-2 border-black hover:bg-black hover:text-[#F4F4EB] transition-none text-center"
              >
                PUBLICAR TÓPICO ANÔNIMO
              </button>
            </form>
          </section>

          {/* Lista Linear de Tópicos */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-black uppercase border-b-2 border-black pb-1">
              TÓPICOS ATIVOS DA SALA
            </h2>
            {threadsDaSala.length === 0 ? (
              <div className="border-2 border-black p-5 sm:p-6 bg-white font-mono text-sm sm:text-base uppercase text-center font-bold">
                [NENHUM EVENTO CLÍNICO OU TÓPICO REGISTRADO NESTA SALA]
              </div>
            ) : (
              threadsDaSala.map((t) => (
                <article
                  key={t.id}
                  onClick={() => {
                    setThreadSelecionadaId(t.id);
                    // Rola suavemente até a coluna de respostas em dispositivos móveis
                    if (window.innerWidth < 1024) {
                      document.getElementById("painel-conversa")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`border-2 border-black p-3.5 sm:p-4 cursor-pointer transition-none ${
                    threadSelecionadaId === t.id
                      ? "bg-black text-[#F4F4EB]"
                      : "bg-white text-black hover:bg-[#F4F4EB]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 border-b border-current pb-2 mb-2 font-mono text-[10px] sm:text-xs font-bold uppercase">
                    <span>AUTOR: {t.authorBotanyAlias}</span>
                    <span className="shrink-0">{t.replyCount} RESPOSTAS</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-black uppercase mb-1 break-words">
                    {t.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-base line-clamp-2 break-words">
                    {t.body}
                  </p>
                </article>
              ))
            )}
          </section>
        </div>

        {/* Coluna 2: Tópico Aberto e Respostas */}
        <div id="painel-conversa">
          {threadAtual ? (
            <div className="border-4 border-black bg-white p-4 sm:p-5 space-y-4">
              <div className="border-b-2 border-black pb-3">
                <div className="flex justify-between items-center font-mono text-[10px] sm:text-xs font-bold uppercase text-black/70 mb-1">
                  <span>AUTOR: {threadAtual.authorBotanyAlias}</span>
                  <span>SALA: {threadAtual.category}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-black uppercase text-[#1A4331] break-words">
                  {threadAtual.title}
                </h2>
                <p className="font-sans text-sm sm:text-base mt-2 font-normal break-words">
                  {threadAtual.body}
                </p>
              </div>

              {/* Respostas */}
              <div className="space-y-3">
                <h3 className="font-serif text-base sm:text-lg font-black uppercase border-b border-black pb-1">
                  RESPOSTAS LINEARES ({respostasAtuais.length})
                </h3>

                {respostasAtuais.length === 0 ? (
                  <div className="p-3 bg-[#F4F4EB] font-mono text-xs sm:text-sm uppercase">
                    [NENHUMA RESPOSTA REGISTRADA ATÉ O MOMENTO]
                  </div>
                ) : (
                  respostasAtuais.map((rep) => (
                    <div key={rep.id} className="border-2 border-black p-3 bg-[#F4F4EB] space-y-1">
                      <div className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#7C2D3A]">
                        AUTOR: {rep.authorBotanyAlias}
                      </div>
                      <p className="font-sans text-sm sm:text-base break-words">
                        {rep.body}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Formulário de Resposta */}
              <form onSubmit={handleEnviarResposta} className="pt-2 border-t-2 border-black space-y-2">
                <label htmlFor="resp-corpo" className="block font-mono text-xs font-bold uppercase">
                  SUA RESPOSTA ({meuAliasBotanico}):
                </label>
                <textarea
                  id="resp-corpo"
                  value={novaRespostaTexto}
                  onChange={(e) => setNovaRespostaTexto(e.target.value)}
                  placeholder="DIGITE SUA RESPOSTA BASEADA EM EXPERIÊNCIA DE VIDA OU APOIO MÚTUO..."
                  className="w-full min-h-[80px] p-3 border-2 border-black font-mono text-sm sm:text-base bg-[#F4F4EB] text-black focus:outline-none focus:bg-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] px-6 bg-black text-[#F4F4EB] font-mono text-xs sm:text-sm font-black uppercase border-2 border-black hover:bg-[#1A4331] transition-none text-center"
                >
                  ENVIAR RESPOSTA
                </button>
              </form>
            </div>
          ) : (
            <div className="border-2 border-black p-6 sm:p-8 bg-white text-center font-mono text-sm sm:text-base uppercase font-bold">
              [SELECIONE UM TÓPICO NA COLUNA AO LADO PARA VISUALIZAR AS INTERAÇÕES]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
