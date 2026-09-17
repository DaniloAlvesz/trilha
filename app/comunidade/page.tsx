"use client";

import React, { useState, useEffect } from "react";
import { CommunityThread, CommunityReply } from "@/types/clinical";

// Regex de Sanitização Médica de Segurança
const REGEX_RESTRICOES_MEDICAS = /(dobrar dose|interromper tratamento|parar de tomar|cloroquina|ozonioterapia|cura milagrosa|ch[aá] milagroso|substituir rem[eé]dio|receita falsa|venda de rem[eé]dio)/i;

// Identidade Botânica Ilustrada e Heurística do Afeto
function getBotanyAvatar(alias: string) {
  const upper = alias.toUpperCase();
  if (upper.includes("JACARANDA")) {
    return {
      icon: "🌸",
      nome: "Jacarandá",
      codigo: alias.replace(/[^0-9]/g, "") || "892",
      badgeClass: "bg-pink-100 text-pink-900 border-pink-200",
    };
  }
  if (upper.includes("BROMELIA")) {
    return {
      icon: "🌿",
      nome: "Bromélia",
      codigo: alias.replace(/[^0-9]/g, "") || "304",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
    };
  }
  if (upper.includes("IPE")) {
    return {
      icon: "🌺",
      nome: "Ipê Roxo",
      codigo: alias.replace(/[^0-9]/g, "") || "112",
      badgeClass: "bg-purple-100 text-purple-900 border-purple-200",
    };
  }
  if (upper.includes("EMBAUBA")) {
    return {
      icon: "🍃",
      nome: "Embaúba",
      codigo: alias.replace(/[^0-9]/g, "") || "405",
      badgeClass: "bg-teal-100 text-teal-900 border-teal-200",
    };
  }
  if (upper.includes("SAMAMBAIA")) {
    return {
      icon: "🪴",
      nome: "Samambaia",
      codigo: alias.replace(/[^0-9]/g, "") || "714",
      badgeClass: "bg-lime-100 text-lime-900 border-lime-200",
    };
  }
  return {
    icon: "🌼",
    nome: "Margarida",
    codigo: alias.replace(/[^0-9]/g, "") || "101",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
  };
}

export default function PapoPrivadoPage() {
  const [meuAliasBotanico] = useState("JACARANDA-892");
  const [salaAtiva, setSalaAtiva] = useState<CommunityThread["category"]>("HORMONIOTERAPIA");

  const [threads, setThreads] = useState<CommunityThread[]>([
    {
      id: "thread-01",
      category: "HORMONIOTERAPIA",
      authorBotanyAlias: "BROMELIA-304",
      title: "Onda de calor (fogacho) no período da madrugada com Tamoxifeno",
      body: "Iniciei o segundo mês e os fogachos me acordam toda madrugada às 3h. Meu oncologista sugeriu mudança no horário da tomada para as manhãs. Alguém ajustou o relógio biológico com sucesso?",
      createdAt: "2026-09-10T22:15:00-03:00",
      replyCount: 2,
    },
    {
      id: "thread-02",
      category: "LINFEDEMA",
      authorBotanyAlias: "IPE-ROXO-112",
      title: "Uso da braçadeira compressiva em voos domésticos",
      body: "Passando para registrar que a fisioterapeuta recomendou a luva/braçadeira de compressão elástica durante o voo por conta da pressurização da cabine. Não tive edema após o pouso.",
      createdAt: "2026-09-09T18:40:00-03:00",
      replyCount: 1,
    },
    {
      id: "thread-03",
      category: "EMOCIONAL",
      authorBotanyAlias: "EMBAUBA-405",
      title: "O silêncio após o último dia de radioterapia",
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
  const [alertaSeguranca, setAlertaSeguranca] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleCriarTopico = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertaSeguranca(null);

    const conteudoCompleto = `${novoTitulo} ${novoTexto}`;
    if (REGEX_RESTRICOES_MEDICAS.test(conteudoCompleto)) {
      setAlertaSeguranca(
        "Por segurança médica de todas nós, não são permitidas publicações com sugestões de alteração de doses ou tratamentos não comprovados."
      );
      return;
    }

    if (!novoTitulo.trim() || !novoTexto.trim()) {
      setAlertaSeguranca("Por favor, preencha o título e o texto da sua mensagem.");
      return;
    }

    const nova: CommunityThread = {
      id: `thread-${Date.now()}`,
      category: salaAtiva,
      authorBotanyAlias: meuAliasBotanico,
      title: novoTitulo.trim(),
      body: novoTexto.trim(),
      createdAt: new Date().toISOString(),
      replyCount: 0,
    };

    setThreads([nova, ...threads]);
    setThreadSelecionadaId(nova.id);
    setNovoTitulo("");
    setNovoTexto("");
    setAlertaSeguranca(null);
    setStatusFeedback("Sua conversa foi iniciada com carinho na comunidade!");
  };

  const handleEnviarResposta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadSelecionadaId) return;

    if (REGEX_RESTRICOES_MEDICAS.test(novaRespostaTexto)) {
      setAlertaSeguranca(
        "Por segurança médica de todas nós, não são permitidas mensagens com sugestão de alteração de doses ou tratamentos não comprovados."
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
    setStatusFeedback("Sua resposta acolhedora foi enviada com sucesso!");
  };

  const threadsDaSala = threads.filter((t) => t.category === salaAtiva);
  const threadAtual = threads.find((t) => t.id === threadSelecionadaId);
  const respostasAtuais = threadSelecionadaId ? respostas[threadSelecionadaId] || [] : [];

  const salasNomes: Record<CommunityThread["category"], string> = {
    HORMONIOTERAPIA: "Hormonioterapia",
    LINFEDEMA: "Linfedema e Cuidados",
    RECONSTRUCAO: "Reconstrução",
    EMOCIONAL: "Apoio Emocional",
  };

  const meuAvatar = getBotanyAvatar(meuAliasBotanico);

  return (
    <div className="space-y-6">
      {/* Cabeçalho Acolhedor */}
      <section className="bg-clinical-paper border border-clinical-surface/40 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="font-sans text-xs sm:text-sm font-semibold text-clinical-action block">
              Comunidade anônima e acolhedora
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clinical-ink mt-0.5">
              Papo Privado entre Mulheres
            </h1>
            <p className="font-sans text-sm sm:text-base text-clinical-ink/80 mt-1 leading-relaxed">
              Troque vivências com outras mulheres na mesma etapa. Para proteger você, todos os nomes são mantidos sob avatares botânicos ilustrados.
            </p>
          </div>

          {/* Badge do Meu Avatar Botânico */}
          <div className={`rounded-2xl border px-3.5 py-2 shrink-0 flex items-center gap-2.5 shadow-xs ${meuAvatar.badgeClass}`}>
            <span className="text-2xl">{meuAvatar.icon}</span>
            <div>
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider block opacity-75">
                Seu perfil anônimo
              </span>
              <span className="font-serif font-bold text-xs sm:text-sm block leading-none">
                {meuAvatar.nome} #{meuAvatar.codigo}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Alertas Empáticos */}
      {alertaSeguranca && (
        <div
          role="alert"
          className="rounded-2xl border border-clinical-alert/30 bg-clinical-alert text-white p-4 font-sans text-xs sm:text-sm font-medium shadow-md leading-relaxed"
        >
          {alertaSeguranca}
        </div>
      )}

      {statusFeedback && (
        <div className="p-3 rounded-2xl bg-clinical-success text-white font-sans text-xs sm:text-sm font-bold shadow-sm text-center">
          ✓ {statusFeedback}
        </div>
      )}

      {/* Seleção de Salas Temáticas com Touch Targets >= 48dp */}
      <section className="space-y-2">
        <span className="font-sans text-xs sm:text-sm font-bold text-clinical-ink block">
          Escolha uma sala para conversar:
        </span>
        <div className="flex flex-wrap gap-2">
          {(["HORMONIOTERAPIA", "LINFEDEMA", "RECONSTRUCAO", "EMOCIONAL"] as const).map((sala) => (
            <button
              key={sala}
              type="button"
              onClick={() => {
                setSalaAtiva(sala);
                setThreadSelecionadaId(null);
              }}
              className={`min-h-[48px] px-4 rounded-2xl font-sans text-xs sm:text-sm font-semibold transition-all select-none active:scale-95 ${
                salaAtiva === sala
                  ? "bg-clinical-action text-white shadow-sm font-bold"
                  : "bg-white text-clinical-ink border border-clinical-surface/30 hover:bg-clinical-paper shadow-xs"
              }`}
            >
              {salasNomes[sala]}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de Fórum em Cards com Drop Shadow Suave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Coluna 1: Criar Tópico & Lista de Cards */}
        <div className="space-y-5">
          {/* Card de Criação */}
          <section className="rounded-3xl border border-clinical-surface/30 bg-white p-5 shadow-sm space-y-3.5">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-clinical-ink border-b border-clinical-surface/20 pb-2">
              Iniciar conversa em {salasNomes[salaAtiva]}
            </h2>
            <form onSubmit={handleCriarTopico} className="space-y-3">
              <div>
                <label htmlFor="topico-titulo" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                  Título da sua dúvida ou relato:
                </label>
                <input
                  id="topico-titulo"
                  type="text"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="Ex: Alguém conseguiu amenizar os fogachos noturnos?"
                  className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/20 font-sans text-sm bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="topico-corpo" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                  Conte sua experiência com tranquilidade:
                </label>
                <textarea
                  id="topico-corpo"
                  value={novoTexto}
                  onChange={(e) => setNovoTexto(e.target.value)}
                  placeholder="Compartilhe seus pensamentos ou dúvidas..."
                  className="w-full min-h-[88px] p-3.5 rounded-xl border border-clinical-ink/20 font-sans text-sm bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-6 rounded-2xl bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-action/90 transition-all shadow-sm active:scale-95"
              >
                Publicar com meu apelido botânico
              </button>
            </form>
          </section>

          {/* Lista de Cards de Fórum com Drop Shadow */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-clinical-ink">
              Conversas na sala ({threadsDaSala.length})
            </h2>

            {threadsDaSala.length === 0 ? (
              <div className="rounded-3xl border border-clinical-surface/30 p-8 bg-white font-sans text-sm text-center text-clinical-ink/70 shadow-sm">
                Ainda não há conversas nesta sala. Que tal começar a primeira?
              </div>
            ) : (
              threadsDaSala.map((t) => {
                const avatar = getBotanyAvatar(t.authorBotanyAlias);
                const isSelected = threadSelecionadaId === t.id;

                return (
                  <article
                    key={t.id}
                    onClick={() => {
                      setThreadSelecionadaId(t.id);
                      if (window.innerWidth < 1024) {
                        document.getElementById("painel-conversa")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`rounded-3xl border p-5 cursor-pointer transition-all shadow-sm select-none ${
                      isSelected
                        ? "border-clinical-action bg-clinical-paper/80 ring-2 ring-clinical-action/20 shadow-md"
                        : "border-clinical-surface/30 bg-white hover:border-clinical-action/40 hover:shadow-md"
                    }`}
                  >
                    {/* Cabeçalho do Card com Avatar Ilustrado */}
                    <div className="flex justify-between items-center gap-2 border-b border-clinical-surface/20 pb-2.5 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base border shadow-2xs ${avatar.badgeClass}`}>
                          {avatar.icon}
                        </div>
                        <div>
                          <span className="font-serif font-bold text-xs sm:text-sm text-clinical-ink block leading-none">
                            {avatar.nome}
                          </span>
                          <span className="font-mono text-[10px] text-clinical-ink/60">
                            #{avatar.codigo}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full bg-clinical-paper px-3 py-1 text-[11px] font-sans font-semibold text-clinical-ink/80 border border-clinical-surface/30">
                        💬 {t.replyCount} {t.replyCount === 1 ? "resposta" : "respostas"}
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-clinical-ink mb-1.5 break-words">
                      {t.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-clinical-ink/80 line-clamp-2 leading-relaxed">
                      {t.body}
                    </p>
                  </article>
                );
              })
            )}
          </section>
        </div>

        {/* Coluna 2: Tópico Selecionado & Respostas (Thumb Zone) */}
        <div id="painel-conversa" className="space-y-4">
          {threadAtual ? (
            <div className="rounded-3xl border border-clinical-surface/30 bg-white p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="border-b border-clinical-surface/20 pb-4">
                <div className="flex justify-between items-center mb-3">
                  {(() => {
                    const autorAvatar = getBotanyAvatar(threadAtual.authorBotanyAlias);
                    return (
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border shadow-xs ${autorAvatar.badgeClass}`}>
                          {autorAvatar.icon}
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-clinical-ink block leading-none">
                            {autorAvatar.nome}
                          </span>
                          <span className="font-mono text-[11px] text-clinical-ink/60">
                            #{autorAvatar.codigo}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <span className="rounded-full bg-clinical-surface/20 text-clinical-action px-3 py-1 text-xs font-bold">
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

              {/* Lista de Respostas com Avatares Ilustrados */}
              <div className="space-y-3">
                <h3 className="font-serif text-base font-bold text-clinical-ink">
                  Acolhimento da comunidade ({respostasAtuais.length})
                </h3>

                {respostasAtuais.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-clinical-paper font-sans text-xs sm:text-sm text-clinical-ink/70">
                    Ainda não há respostas nesta conversa. Que tal enviar uma mensagem de carinho?
                  </div>
                ) : (
                  respostasAtuais.map((rep) => {
                    const repAvatar = getBotanyAvatar(rep.authorBotanyAlias);
                    return (
                      <div
                        key={rep.id}
                        className="rounded-2xl border border-clinical-surface/30 p-3.5 bg-clinical-paper space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${repAvatar.badgeClass}`}>
                            {repAvatar.icon}
                          </div>
                          <span className="font-serif font-bold text-xs text-clinical-ink">
                            {repAvatar.nome} #{repAvatar.codigo}
                          </span>
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-clinical-ink leading-relaxed break-words pl-9">
                          {rep.body}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Caixa de Resposta Ergonômica (Thumb Zone) */}
              <form onSubmit={handleEnviarResposta} className="pt-3 border-t border-clinical-surface/20 space-y-3">
                <label htmlFor="resp-corpo" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink">
                  Deixe uma mensagem de apoio ({meuAvatar.nome}):
                </label>
                <textarea
                  id="resp-corpo"
                  value={novaRespostaTexto}
                  onChange={(e) => setNovaRespostaTexto(e.target.value)}
                  placeholder="Escreva palavras de incentivo ou conte como você superou esse momento..."
                  className="w-full min-h-[84px] p-3.5 rounded-2xl border border-clinical-ink/20 font-sans text-sm bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] px-6 rounded-2xl bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-action/90 transition-all shadow-sm active:scale-95"
                >
                  Enviar mensagem de apoio
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl border border-clinical-surface/30 p-8 sm:p-12 bg-white text-center font-sans text-sm text-clinical-ink/70 shadow-sm">
              👈 Toque em uma das conversas ao lado para ler e participar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
