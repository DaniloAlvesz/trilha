"use client";

import React, { useState } from "react";
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
      handle: "@jacaranda892",
      codigo: "892",
      badgeClass: "bg-pink-100 text-pink-900 border-pink-200",
    };
  }
  if (upper.includes("BROMELIA")) {
    return {
      icon: "🌿",
      nome: "Bromélia",
      handle: "@bromelia304",
      codigo: "304",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
    };
  }
  if (upper.includes("IPE")) {
    return {
      icon: "🌺",
      nome: "Ipê Roxo",
      handle: "@iperoxo112",
      codigo: "112",
      badgeClass: "bg-purple-100 text-purple-900 border-purple-200",
    };
  }
  if (upper.includes("EMBAUBA")) {
    return {
      icon: "🍃",
      nome: "Embaúba",
      handle: "@embauba405",
      codigo: "405",
      badgeClass: "bg-teal-100 text-teal-900 border-teal-200",
    };
  }
  if (upper.includes("SAMAMBAIA")) {
    return {
      icon: "🪴",
      nome: "Samambaia",
      handle: "@samambaia714",
      codigo: "714",
      badgeClass: "bg-lime-100 text-lime-900 border-lime-200",
    };
  }
  return {
    icon: "🌼",
    nome: "Margarida",
    handle: `@flor${alias.replace(/[^0-9]/g, "") || "101"}`,
    codigo: alias.replace(/[^0-9]/g, "") || "101",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
  };
}

export default function PapoPrivadoPage() {
  const [meuAliasBotanico] = useState("JACARANDA-892");
  const [abaAtiva, setAbaAtiva] = useState<"TODOS" | CommunityThread["category"]>("TODOS");

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
      body: "A transição de ir ao hospital todos os dias para voltar para casa sem consultas semanais gerou um vazio esquisito. A sensação de abandono da rotina de cuidado é real. Como vocês lidaram no primeiro mês?",
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

  // Estado de Apoio/Curtidas estilo Twitter
  const [apoios, setApoios] = useState<Record<string, { count: number; active: boolean }>>({
    "thread-01": { count: 8, active: true },
    "thread-02": { count: 14, active: false },
    "thread-03": { count: 21, active: false },
  });

  const [salvos, setSalvos] = useState<Record<string, boolean>>({
    "thread-02": true,
  });

  const [threadAbertaId, setThreadAbertaId] = useState<string | null>("thread-01");
  const [novoTweetTexto, setNovoTweetTexto] = useState("");
  const [categoriaNovoTweet, setCategoriaNovoTweet] = useState<CommunityThread["category"]>("HORMONIOTERAPIA");
  const [novaRespostaTexto, setNovaRespostaTexto] = useState("");
  const [alertaSeguranca, setAlertaSeguranca] = useState<string | null>(null);
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);

  const meuAvatar = getBotanyAvatar(meuAliasBotanico);

  const salasNomes: Record<CommunityThread["category"], string> = {
    HORMONIOTERAPIA: "Hormonioterapia",
    LINFEDEMA: "Linfedema",
    RECONSTRUCAO: "Reconstrução",
    EMOCIONAL: "Apoio Emocional",
  };

  const abasDisponiveis = [
    { id: "TODOS", label: "Para você" },
    { id: "HORMONIOTERAPIA", label: "Hormonioterapia" },
    { id: "LINFEDEMA", label: "Linfedema" },
    { id: "EMOCIONAL", label: "Emocional" },
    { id: "RECONSTRUCAO", label: "Reconstrução" },
  ] as const;

  const handleToggleApoio = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApoios((prev) => {
      const atual = prev[threadId] || { count: 0, active: false };
      const novoActive = !atual.active;
      return {
        ...prev,
        [threadId]: {
          active: novoActive,
          count: novoActive ? atual.count + 1 : Math.max(0, atual.count - 1),
        },
      };
    });
  };

  const handleToggleSalvo = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSalvos((prev) => {
      const novo = !prev[threadId];
      setToastMensagem(novo ? "Publicação salva nos seus itens guardados" : "Removido dos salvos");
      setTimeout(() => setToastMensagem(null), 3000);
      return { ...prev, [threadId]: novo };
    });
  };

  const handleCriarPublicacao = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertaSeguranca(null);

    if (REGEX_RESTRICOES_MEDICAS.test(novoTweetTexto)) {
      setAlertaSeguranca(
        "Por proteção de todos, não são permitidas publicações com sugestões de alteração de doses ou tratamentos não orientados pela equipe médica."
      );
      return;
    }

    if (!novoTweetTexto.trim()) {
      setAlertaSeguranca("Escreva algo para compartilhar com a comunidade.");
      return;
    }

    const linhas = novoTweetTexto.trim().split("\n");
    const titulo = linhas[0].slice(0, 70);
    const corpo = linhas.length > 1 ? linhas.slice(1).join("\n").trim() : novoTweetTexto.trim();

    const novoPost: CommunityThread = {
      id: `thread-${Date.now()}`,
      category: categoriaNovoTweet,
      authorBotanyAlias: meuAliasBotanico,
      title: titulo,
      body: corpo,
      createdAt: new Date().toISOString(),
      replyCount: 0,
    };

    setThreads([novoPost, ...threads]);
    setApoios((prev) => ({ ...prev, [novoPost.id]: { count: 0, active: false } }));
    setThreadAbertaId(novoPost.id);
    setNovoTweetTexto("");
    setAlertaSeguranca(null);
    setToastMensagem("Publicado com carinho no feed!");
    setTimeout(() => setToastMensagem(null), 3000);
  };

  const handleEnviarResposta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadAbertaId) return;

    if (REGEX_RESTRICOES_MEDICAS.test(novaRespostaTexto)) {
      setAlertaSeguranca(
        "Por proteção de todos, não são permitidas respostas com sugestão de alteração de doses ou tratamentos não orientados pela equipe médica."
      );
      return;
    }

    if (!novaRespostaTexto.trim()) return;

    const novaRep: CommunityReply = {
      id: `rep-${Date.now()}`,
      threadId: threadAbertaId,
      authorBotanyAlias: meuAliasBotanico,
      body: novaRespostaTexto.trim(),
      createdAt: new Date().toISOString(),
    };

    const listaAtual = respostas[threadAbertaId] || [];
    setRespostas({
      ...respostas,
      [threadAbertaId]: [...listaAtual, novaRep],
    });

    setThreads(
      threads.map((t) =>
        t.id === threadAbertaId ? { ...t, replyCount: t.replyCount + 1 } : t
      )
    );

    setNovaRespostaTexto("");
    setAlertaSeguranca(null);
    setToastMensagem("Sua resposta acolhedora foi enviada!");
    setTimeout(() => setToastMensagem(null), 3000);
  };

  const threadsFiltradas =
    abaAtiva === "TODOS" ? threads : threads.filter((t) => t.category === abaAtiva);
  const threadAtual = threads.find((t) => t.id === threadAbertaId);
  const respostasDaThreadAtual = threadAbertaId ? respostas[threadAbertaId] || [] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Toast Notificação Suave */}
      {toastMensagem && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-clinical-ink text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg animate-bounce">
          ✓ {toastMensagem}
        </div>
      )}

      {/* Header Estilo Twitter: Limpo com "Papo Privado" */}
      <header className="bg-white rounded-3xl border border-clinical-surface/30 shadow-sm overflow-hidden sticky top-14 z-20">
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-clinical-surface/20">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink leading-tight">
              Papo Privado
            </h1>
            <p className="font-sans text-[11px] sm:text-xs text-clinical-ink/65">
              Compartilhe pensamentos e apoio com total privacidade
            </p>
          </div>

          {/* Avatar da Conta Atual */}
          <div className={`rounded-full border px-3 py-1 flex items-center gap-2 shadow-2xs ${meuAvatar.badgeClass}`}>
            <span className="text-base">{meuAvatar.icon}</span>
            <span className="font-serif font-bold text-xs text-clinical-ink">
              {meuAvatar.nome}
            </span>
          </div>
        </div>

        {/* Abas Superiores Estilo Twitter (Feed Tabs) */}
        <nav className="flex overflow-x-auto no-scrollbar border-b border-clinical-surface/15 bg-white">
          {abasDisponiveis.map((aba) => {
            const isSelected = abaAtiva === aba.id;
            return (
              <button
                key={aba.id}
                type="button"
                onClick={() => setAbaAtiva(aba.id as typeof abaAtiva)}
                className="flex-1 min-w-max px-4 py-3 text-xs sm:text-sm font-sans font-semibold transition-all relative flex flex-col items-center justify-center select-none"
              >
                <span className={isSelected ? "text-clinical-action font-bold" : "text-clinical-ink/60 hover:text-clinical-ink"}>
                  {aba.label}
                </span>
                {isSelected && (
                  <span className="absolute bottom-0 w-8 sm:w-12 h-1 bg-clinical-action rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Alerta de Segurança se disparado */}
      {alertaSeguranca && (
        <div
          role="alert"
          className="rounded-2xl bg-clinical-alert text-white p-4 font-sans text-xs sm:text-sm font-medium shadow-sm leading-relaxed"
        >
          {alertaSeguranca}
        </div>
      )}

      {/* Tweet Composer: "O que você gostaria de compartilhar?" */}
      <section className="bg-white rounded-3xl border border-clinical-surface/30 p-4 sm:p-5 shadow-sm space-y-3">
        <form onSubmit={handleCriarPublicacao} className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 border ${meuAvatar.badgeClass}`}>
              {meuAvatar.icon}
            </div>

            <div className="flex-1 space-y-2">
              <textarea
                value={novoTweetTexto}
                onChange={(e) => setNovoTweetTexto(e.target.value)}
                placeholder="Como você está se sentindo hoje? Compartilhe um momento ou dúvida..."
                className="w-full min-h-[72px] resize-none border-0 p-1 font-sans text-sm sm:text-base text-clinical-ink placeholder:text-clinical-ink/40 focus:outline-none focus:ring-0 bg-transparent"
                rows={2}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-clinical-surface/15">
                {/* Seleção de Tópico / Hashtag */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-sans font-semibold text-clinical-ink/60">
                    Assunto:
                  </span>
                  {(["HORMONIOTERAPIA", "LINFEDEMA", "EMOCIONAL", "RECONSTRUCAO"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoriaNovoTweet(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-sans font-medium transition-all ${
                        categoriaNovoTweet === cat
                          ? "bg-clinical-surface/20 text-clinical-action font-bold border border-clinical-action/30"
                          : "text-clinical-ink/60 hover:bg-clinical-paper border border-transparent"
                      }`}
                    >
                      #{salasNomes[cat]}
                    </button>
                  ))}
                </div>

                {/* Botão Publicar estilo Twitter */}
                <button
                  type="submit"
                  className="min-h-[44px] px-6 rounded-full bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-action/90 active:scale-95 transition-all shadow-sm"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Feed Principal Estilo Linha do Tempo do Twitter */}
      <div className="space-y-3">
        {threadsFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl border border-clinical-surface/30 p-8 text-center text-clinical-ink/60 font-sans text-sm">
            Nenhuma publicação nesta aba ainda. Que tal começar a conversa?
          </div>
        ) : (
          threadsFiltradas.map((post) => {
            const autor = getBotanyAvatar(post.authorBotanyAlias);
            const isAberta = threadAbertaId === post.id;
            const apoioAtual = apoios[post.id] || { count: 0, active: false };
            const isSalvo = Boolean(salvos[post.id]);

            return (
              <article
                key={post.id}
                onClick={() => setThreadAbertaId(isAberta ? null : post.id)}
                className={`bg-white rounded-3xl border transition-all cursor-pointer overflow-hidden shadow-sm ${
                  isAberta
                    ? "border-clinical-action ring-2 ring-clinical-action/15"
                    : "border-clinical-surface/30 hover:border-clinical-action/40 hover:shadow-md"
                }`}
              >
                {/* Tweet Card */}
                <div className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
                  {/* Coluna da Esquerda: Avatar Circular Botânico */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0 border shadow-2xs ${autor.badgeClass}`}>
                    {autor.icon}
                  </div>

                  {/* Coluna da Direita: Conteúdo do Tweet */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Header do Tweet: Nome, Handle, Horário, Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="font-serif font-bold text-sm sm:text-base text-clinical-ink truncate">
                          {autor.nome}
                        </span>
                        <span className="font-mono text-xs text-clinical-ink/50 truncate">
                          {autor.handle}
                        </span>
                        <span className="text-clinical-ink/40 text-xs">·</span>
                        <span className="text-[11px] font-sans text-clinical-ink/60">
                          {new Date(post.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                        </span>
                      </div>

                      <span className="text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-clinical-paper text-clinical-action border border-clinical-surface/30">
                        #{salasNomes[post.category]}
                      </span>
                    </div>

                    {/* Título opcional como destaque da conversa */}
                    {post.title && (
                      <h2 className="font-serif font-bold text-sm sm:text-base text-clinical-ink leading-snug">
                        {post.title}
                      </h2>
                    )}

                    {/* Texto do Post / Tweet */}
                    <p className="font-sans text-sm sm:text-[15px] text-clinical-ink/85 leading-relaxed break-words">
                      {post.body}
                    </p>

                    {/* Twitter Action Bar (💬 Respostas, ❤️ Curtir/Apoiar, 🔖 Salvar) */}
                    <div className="pt-2 flex items-center justify-between max-w-sm text-xs text-clinical-ink/60 font-sans">
                      {/* Respostas */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThreadAbertaId(post.id);
                        }}
                        className="inline-flex items-center gap-1.5 hover:text-clinical-action transition-colors p-1.5 rounded-full hover:bg-clinical-paper"
                        aria-label="Ver respostas"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{post.replyCount}</span>
                      </button>

                      {/* Apoio / Coração */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleApoio(post.id, e)}
                        className={`inline-flex items-center gap-1.5 transition-colors p-1.5 rounded-full hover:bg-pink-50 ${
                          apoioAtual.active
                            ? "text-rose-600 font-bold"
                            : "hover:text-rose-600 text-clinical-ink/60"
                        }`}
                        aria-label="Apoiar publicação"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${apoioAtual.active ? "scale-115 fill-current" : ""}`}
                          fill={apoioAtual.active ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{apoioAtual.count}</span>
                      </button>

                      {/* Salvar nos Favoritos */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleSalvo(post.id, e)}
                        className={`inline-flex items-center gap-1.5 transition-colors p-1.5 rounded-full hover:bg-clinical-paper ${
                          isSalvo ? "text-clinical-action font-bold" : "hover:text-clinical-action"
                        }`}
                        aria-label="Salvar publicação"
                      >
                        <svg
                          className={`w-4 h-4 ${isSalvo ? "fill-current" : ""}`}
                          fill={isSalvo ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>

                      {/* Compartilhar */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setToastMensagem("Link da conversa copiado com segurança!");
                          setTimeout(() => setToastMensagem(null), 3000);
                        }}
                        className="inline-flex items-center gap-1.5 hover:text-clinical-action transition-colors p-1.5 rounded-full hover:bg-clinical-paper"
                        aria-label="Compartilhar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Linha de Conversa / Thread Aberta com Respostas Aninhadas */}
                {isAberta && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="border-t border-clinical-surface/20 bg-clinical-paper/40 p-4 sm:p-5 space-y-4 cursor-default"
                  >
                    <h3 className="font-serif text-sm font-bold text-clinical-ink">
                      Respostas nesta conversa ({respostasDaThreadAtual.length})
                    </h3>

                    {/* Respostas com linha conectora vertical estilo Twitter */}
                    <div className="space-y-3 relative">
                      {respostasDaThreadAtual.length === 0 ? (
                        <p className="text-xs text-clinical-ink/60 font-sans italic py-2">
                          Seja a primeira pessoa a responder com carinho...
                        </p>
                      ) : (
                        respostasDaThreadAtual.map((rep) => {
                          const repAutor = getBotanyAvatar(rep.authorBotanyAlias);
                          return (
                            <div key={rep.id} className="flex gap-3 items-start relative">
                              {/* Avatar de quem respondeu */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border ${repAutor.badgeClass}`}>
                                {repAutor.icon}
                              </div>

                              <div className="flex-1 bg-white p-3.5 rounded-2xl border border-clinical-surface/25 shadow-2xs space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-serif font-bold text-xs text-clinical-ink">
                                    {repAutor.nome}
                                  </span>
                                  <span className="font-mono text-[10px] text-clinical-ink/50">
                                    {repAutor.handle}
                                  </span>
                                </div>
                                <p className="font-sans text-xs sm:text-sm text-clinical-ink/85 leading-relaxed break-words">
                                  {rep.body}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Caixa de Resposta Embutida */}
                    <form onSubmit={handleEnviarResposta} className="pt-2 flex gap-2.5 items-end">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border ${meuAvatar.badgeClass}`}>
                        {meuAvatar.icon}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={novaRespostaTexto}
                          onChange={(e) => setNovaRespostaTexto(e.target.value)}
                          placeholder={`Responder para ${autor.handle}...`}
                          className="flex-1 min-h-[44px] px-4 rounded-full border border-clinical-surface/40 font-sans text-xs sm:text-sm bg-white text-clinical-ink focus:outline-none focus:ring-2 focus:ring-clinical-action/20"
                        />
                        <button
                          type="submit"
                          className="min-h-[44px] px-5 rounded-full bg-clinical-action text-white font-sans text-xs font-bold hover:bg-clinical-action/90 active:scale-95 transition-all shadow-xs shrink-0"
                        >
                          Responder
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
