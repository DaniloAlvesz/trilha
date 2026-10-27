"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useCare } from "@/components/CareProvider";
import { dateLabel } from "@/lib/care";
import {
  emptyForum,
  EXAMPLE_THREADS,
  FORUM_CATEGORIES,
  isExampleThread,
  newForumAlias,
  type ForumCategory,
  type ForumState,
  type ForumThread,
} from "@/lib/forum";
const REPORT_REASONS = [
  "Orientação de saúde perigosa",
  "Ofensa ou discriminação",
  "Exposição de dados pessoais",
  "Propaganda ou outro motivo",
];
export default function ForumPage() {
  return (
    <Suspense fallback={<p role="status">Abrindo o fórum…</p>}>
      <AnonymousForum />
    </Suspense>
  );
}
function AnonymousForum() {
  const params = useSearchParams();
  const router = useRouter();
  const { data, update, ready, notify } = useCare();
  const forum = data.forum ?? emptyForum();
  const [category, setCategory] = useState("Todos os assuntos");
  const [tab, setTab] = useState("Conversas");
  const [search, setSearch] = useState("");
  const openId = params.get("conversa") || "";
  const composing = params.get("nova") === "1";
  const setOpenId = (id: string) =>
    router.push(
      id ? `/comunidade?conversa=${encodeURIComponent(id)}` : "/comunidade",
    );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState<ForumCategory>("Dia a dia");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [reportId, setReportId] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [removeId, setRemoveId] = useState("");
  const [showExamples, setShowExamples] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const composeHeading = useRef<HTMLHeadingElement>(null);
  const updateForum = (fn: (f: ForumState) => ForumState) =>
    update((d) => ({ ...d, forum: fn(d.forum ?? emptyForum()) }));
  const all = [...forum.threads, ...(showExamples ? EXAMPLE_THREADS : [])];
  const hiddenIds = new Set(forum.reports.map((r) => r.threadId));
  const visible = all.filter(
    (t) => !forum.blockedAuthors.includes(t.author) && !hiddenIds.has(t.id),
  );
  const active = visible.find((t) => t.id === openId);
  const normalized = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const filtered = visible.filter(
    (t) =>
      (category === "Todos os assuntos" || t.category === category) &&
      (tab === "Conversas" ||
        (tab === "Salvas"
          ? forum.saved.includes(t.id)
          : !isExampleThread(t.id))) &&
      normalized(`${t.title} ${t.body} ${t.category}`).includes(
        normalized(search.trim()),
      ),
  );
  useEffect(() => {
    if (active) detailHeading.current?.focus();
  }, [active?.id]);
  useEffect(() => {
    if (composing) composeHeading.current?.focus();
  }, [composing]);
  useEffect(() => {
    if (!title && !body && !reply) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [title, body, reply]);
  useEffect(() => {
    setPage(1);
  }, [category, tab, search, showExamples]);
  useEffect(() => {
    if (page > 1 && (page - 1) * pageSize >= filtered.length)
      setPage(Math.max(1, Math.ceil(filtered.length / pageSize)));
  }, [page, filtered.length]);
  function identity() {
    return forum.alias || newForumAlias();
  }
  function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Escreva um título e sua mensagem antes de guardar a conversa.");
      return;
    }
    if (forum.threads.length >= 100) {
      setError(
        "Este protótipo aceita até 100 conversas suas. Exclua uma conversa antiga antes de adicionar outra.",
      );
      return;
    }
    const alias = identity();
    const id = crypto.randomUUID();
    updateForum((f) => ({
      ...f,
      alias,
      threads: [
        {
          id,
          title: title.trim(),
          body: body.trim(),
          category: topic,
          author: alias,
          createdAt: new Date().toISOString(),
        },
        ...f.threads,
      ],
    }));
    setTitle("");
    setBody("");
    setError("");
    setOpenId(id);
    notify(
      "Conversa guardada no seu protótipo. Ela não foi enviada a outras pessoas.",
    );
  }
  function respond(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !active) return;
    if (forum.replies.length >= 500) {
      setError(
        "O limite de respostas deste protótipo foi atingido. Exclua uma resposta antiga para continuar.",
      );
      return;
    }
    const alias = identity();
    updateForum((f) => ({
      ...f,
      alias,
      replies: [
        ...f.replies,
        {
          id: crypto.randomUUID(),
          threadId: active.id,
          author: alias,
          body: reply.trim(),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setReply("");
    setError("");
    notify(
      "Resposta guardada neste aparelho. Nenhuma outra pessoa foi notificada.",
    );
  }
  function toggle(key: "saved" | "supported", id: string) {
    updateForum((f) => ({
      ...f,
      [key]: f[key].includes(id)
        ? f[key].filter((x) => x !== id)
        : [...f[key], id],
    }));
  }
  function removeThread(id: string) {
    updateForum((f) => ({
      ...f,
      threads: f.threads.filter((t) => t.id !== id),
      replies: f.replies.filter((r) => r.threadId !== id),
      saved: f.saved.filter((x) => x !== id),
      supported: f.supported.filter((x) => x !== id),
    }));
    setRemoveId("");
    setOpenId("");
    notify("Sua conversa e suas respostas nela foram excluídas do protótipo.");
  }
  function threadActions(thread: ForumThread) {
    const example = isExampleThread(thread.id);
    return (
      <div className="forum-actions">
        <button
          className="text-button"
          aria-pressed={forum.supported.includes(thread.id)}
          onClick={() => toggle("supported", thread.id)}
        >
          <Icon name="heart" size={18} />
          {forum.supported.includes(thread.id) ? "Apoiado por você" : "Apoiar"}
        </button>
        <button
          className="text-button"
          aria-pressed={forum.saved.includes(thread.id)}
          onClick={() => toggle("saved", thread.id)}
        >
          {forum.saved.includes(thread.id)
            ? "Conversa salva"
            : "Salvar conversa"}
        </button>
        <details className="forum-more-actions">
          <summary>Mais opções</summary>
          {example ? (
            <>
              <button
                className="text-button"
                onClick={() => {
                  setReportId(reportId === thread.id ? "" : thread.id);
                  setReportReason("");
                }}
              >
                Denunciar
              </button>
              <button
                className="text-button"
                onClick={() => {
                  updateForum((f) => ({
                    ...f,
                    blockedAuthors: [...f.blockedAuthors, thread.author],
                  }));
                  setOpenId("");
                  notify(
                    "Apelido bloqueado neste protótipo. Você pode desfazer em “Conteúdos ocultados”.",
                  );
                }}
              >
                Bloquear apelido
              </button>
            </>
          ) : (
            <button
              className="text-button"
              onClick={() => setRemoveId(thread.id)}
            >
              Excluir minha conversa
            </button>
          )}
        </details>
      </div>
    );
  }
  function inlinePanels(thread: ForumThread) {
    return (
      <>
        {reportId === thread.id && (
          <form
            className="forum-inline-panel form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (!reportReason) return;
              updateForum((f) => ({
                ...f,
                reports: [
                  ...f.reports.filter((r) => r.threadId !== thread.id),
                  { threadId: thread.id, reason: reportReason },
                ],
              }));
              setReportId("");
              setOpenId("");
              notify(
                "Conversa ocultada neste aparelho. A denúncia não foi enviada: este protótipo não tem equipe de moderação.",
              );
            }}
          >
            <h3>Por que deseja ocultar esta conversa?</h3>
            <p className="small">
              Nesta versão, a denúncia só oculta a conversa no seu aparelho. Não
              há envio a uma equipe.
            </p>
            <label htmlFor={`report-${thread.id}`}>Escolha um motivo</label>
            <select
              id={`report-${thread.id}`}
              name="report-reason"
              autoComplete="off"
              required
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">Selecione um motivo</option>
              {REPORT_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <div className="actions">
              <button className="button">Ocultar e registrar motivo</button>
              <button
                type="button"
                className="button secondary"
                onClick={() => setReportId("")}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {removeId === thread.id && (
          <div className="forum-inline-panel">
            <p>
              Excluir esta conversa e as respostas guardadas nela? Esta ação não
              pode ser desfeita.
            </p>
            <div className="actions">
              <button
                className="button danger"
                onClick={() => removeThread(thread.id)}
              >
                Sim, excluir conversa
              </button>
              <button
                className="button secondary"
                onClick={() => setRemoveId("")}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
  return (
    <div className="page-stack forum-page">
      <div className="page-heading">
        <div>
          <h1>Fórum anônimo</h1>
        </div>
      </div>
      <p className="forum-prototype-note">
        Protótipo local: conversas não são compartilhadas.
      </p>
      {openId && !active && ready && (
        <p role="status" className="info-note">
          Esta conversa não está disponível neste aparelho. Ela pode ter sido
          excluída ou ocultada.
        </p>
      )}
      {!active && !composing && (
        <>
          <section className="forum-intro">
            {forum.alias && (
              <div>
                <span className="small">Seu apelido</span>
                <strong>{forum.alias}</strong>
              </div>
            )}
            <Link
              className="button"
              href="/comunidade?nova=1"
              onClick={() => setError("")}
            >
              Nova conversa <Icon name="plus" size={18} />
            </Link>
          </section>
          <details className="forum-filters">
            <summary>Buscar e filtrar conversas</summary>
            <section className="forum-search">
              <label htmlFor="forum-search">O que você quer encontrar?</label>
              <input
                id="forum-search"
                name="search"
                autoComplete="off"
                type="search"
                value={search}
                maxLength={100}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Por exemplo: consulta ou apoio…"
              />
              <div className="forum-filter-row">
                <div>
                  <label htmlFor="forum-category">Assunto</label>
                  <select
                    id="forum-category"
                    name="category"
                    autoComplete="off"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {["Todos os assuntos", ...FORUM_CATEGORIES].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <label className="check-label forum-example-toggle">
                  <input
                    type="checkbox"
                    checked={showExamples}
                    onChange={(e) => setShowExamples(e.target.checked)}
                  />
                  <span>Mostrar conversas de exemplo</span>
                </label>
              </div>
            </section>
            <div
              className="subnav"
              role="group"
              aria-label="Escolher lista de conversas"
            >
              {["Conversas", "Salvas", "Minhas"].map((t) => (
                <button
                  key={t}
                  aria-pressed={tab === t}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </details>
          <p className="small" role="status">
            {filtered.length}{" "}
            {filtered.length === 1
              ? "conversa encontrada"
              : "conversas encontradas"}
          </p>
          <div className="forum-feed">
            {filtered.slice((page - 1) * pageSize, page * pageSize).map((t) => (
              <article className="card forum-thread-card" key={t.id}>
                <div className="forum-meta">
                  <span className="forum-category-tag">{t.category}</span>
                  <span className="small">
                    {isExampleThread(t.id)
                      ? "Exemplo · conversa fictícia"
                      : "Sua conversa neste aparelho"}
                  </span>
                </div>
                <p className="forum-author">{t.author}</p>
                <h2>
                  <Link
                    className="forum-thread-link"
                    href={`/comunidade?conversa=${encodeURIComponent(t.id)}`}
                    onClick={() => {
                      setReply("");
                      setError("");
                    }}
                  >
                    {t.title}
                  </Link>
                </h2>
                <p className="forum-excerpt">{t.body}</p>
                <Link
                  className="forum-open-link text-button"
                  href={`/comunidade?conversa=${encodeURIComponent(t.id)}`}
                  onClick={() => {
                    setReply("");
                    setError("");
                  }}
                >
                  Ler conversa ·{" "}
                  {forum.replies.filter((r) => r.threadId === t.id).length}{" "}
                  respostas neste aparelho
                </Link>
                {threadActions(t)}
                {inlinePanels(t)}
              </article>
            ))}
          </div>
          {filtered.length > pageSize && (
            <nav
              className="forum-pagination actions"
              aria-label="Páginas de conversas"
            >
              <button
                className="button secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
              <span>
                Página {page} de {Math.ceil(filtered.length / pageSize)}
              </span>
              <button
                className="button secondary"
                disabled={page * pageSize >= filtered.length}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </button>
            </nav>
          )}
          {!filtered.length && (
            <section className="card empty">
              <h2>
                {tab === "Salvas"
                  ? "Suas conversas salvas ficam aqui."
                  : tab === "Minhas"
                    ? "Sua primeira conversa pode começar agora."
                    : "Nenhuma conversa com esses filtros."}
              </h2>
              <p>
                {tab === "Salvas"
                  ? "Toque em “Salvar conversa” quando quiser encontrar um assunto depois."
                  : "Você pode trocar o assunto, limpar a busca ou iniciar uma conversa."}
              </p>
              <div className="actions">
                <button
                  className="button secondary"
                  onClick={() => {
                    setSearch("");
                    setCategory("Todos os assuntos");
                    setTab("Conversas");
                  }}
                >
                  Ver todas as conversas
                </button>
                <Link className="button" href="/comunidade?nova=1">
                  Nova conversa
                </Link>
              </div>
            </section>
          )}
        </>
      )}
      {composing && (
        <section className="card form-stack">
          <Link
            className="back-link"
            href="/comunidade"
            onClick={() => setError("")}
          >
            ← Voltar às conversas
          </Link>
          <h2 ref={composeHeading} tabIndex={-1}>
            Começar uma conversa
          </h2>
          <p>
            Você aparece com um apelido. Evite nome completo, telefone,
            documentos e informações que identifiquem alguém.
          </p>
          <form className="form-stack" onSubmit={publish}>
            <div>
              <label htmlFor="new-category">Sobre qual assunto?</label>
              <select
                id="new-category"
                name="category"
                autoComplete="off"
                value={topic}
                onChange={(e) => setTopic(e.target.value as ForumCategory)}
              >
                {FORUM_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="new-title">Dê um título à sua conversa</label>
              <input
                id="new-title"
                name="title"
                autoComplete="off"
                required
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Por exemplo: como pedir companhia para uma consulta…"
              />
            </div>
            <div>
              <label htmlFor="new-message">
                O que você gostaria de compartilhar?
              </label>
              <textarea
                id="new-message"
                name="message"
                autoComplete="off"
                required
                maxLength={2000}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Por exemplo: gostaria de conversar sobre…"
              />
              <p className="small">
                Até 2.000 caracteres. Relatos pessoais não substituem
                orientações da equipe de saúde.
              </p>
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="button" disabled={!ready}>
              Guardar conversa no protótipo
            </button>
          </form>
        </section>
      )}
      {active && (
        <section className="card forum-detail">
          <Link
            className="back-link"
            href="/comunidade"
            onClick={() => setError("")}
          >
            ← Voltar às conversas
          </Link>
          <div className="forum-meta">
            <span className="forum-category-tag">{active.category}</span>
            <span className="small">
              {isExampleThread(active.id)
                ? "Exemplo · conversa fictícia"
                : "Sua conversa neste aparelho"}
            </span>
          </div>
          <h2 ref={detailHeading} tabIndex={-1}>
            {active.title}
          </h2>
          <p className="forum-author">
            {active.author}
            {!isExampleThread(active.id) &&
              ` · ${dateLabel(active.createdAt, true)}`}
          </p>
          <p className="pre-wrap">{active.body}</p>
          {threadActions(active)}
          {inlinePanels(active)}
          <hr className="divider" />
          <h3>Respostas nesta conversa</h3>
          {!forum.replies.some((r) => r.threadId === active.id) && (
            <p>
              Ainda não há respostas guardadas neste aparelho. Você pode testar
              uma resposta abaixo.
            </p>
          )}
          {forum.replies
            .filter((r) => r.threadId === active.id)
            .map((r) => (
              <article className="forum-reply" key={r.id}>
                <strong>{r.author} · você</strong>
                <p className="small">{dateLabel(r.createdAt, true)}</p>
                <p className="pre-wrap">{r.body}</p>
                {removeId !== r.id ? (
                  <button
                    className="text-button"
                    onClick={() => setRemoveId(r.id)}
                  >
                    Excluir minha resposta
                  </button>
                ) : (
                  <div className="forum-inline-panel">
                    <p>Excluir esta resposta?</p>
                    <div className="actions">
                      <button
                        className="button danger"
                        onClick={() => {
                          updateForum((f) => ({
                            ...f,
                            replies: f.replies.filter((x) => x.id !== r.id),
                          }));
                          setRemoveId("");
                          notify("Resposta excluída.");
                        }}
                      >
                        Sim, excluir resposta
                      </button>
                      <button
                        className="button secondary"
                        onClick={() => setRemoveId("")}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          <form className="form-stack" onSubmit={respond}>
            <div>
              <label htmlFor="forum-reply">Sua resposta</label>
              <textarea
                id="forum-reply"
                name="reply"
                autoComplete="off"
                required
                maxLength={2000}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Por exemplo: entendo como isso pode ser difícil…"
              />
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="button" disabled={!ready}>
              Guardar resposta no protótipo
            </button>
          </form>
        </section>
      )}
      <section className="forum-guidelines">
        <details>
          <summary>Seu apelido, seus dados e as regras de cuidado</summary>
          <p>
            O apelido evita mostrar seu nome na interface, mas não garante
            anonimato absoluto. Quem usa este navegador pode ver seus registros.
            Não compartilhe dados pessoais ou imagens de terceiros.
          </p>
          <p>
            Respeite outras experiências. Não faça propaganda, não prometa cura
            e não recomende interromper ou alterar medicamentos. A equipe de
            saúde é a referência para decisões de tratamento.
          </p>
          <p>
            {data.remember
              ? "Você escolheu manter os registros neste navegador, incluindo suas conversas."
              : "As conversas ficam só na aba aberta. Atualizar ou fechar pode apagá-las."}{" "}
            <Link href="/ajustes">Ver preferências de armazenamento</Link>.
          </p>
          <p>
            Em uma emergência, ligue <a href="tel:192">192</a>. Para apoio
            emocional, o <a href="https://cvv.org.br/">CVV</a> atende pelo{" "}
            <a href="tel:188">188</a>.
          </p>
          {forum.alias && (
            <button
              className="text-button"
              onClick={() => {
                updateForum((f) => ({ ...f, alias: newForumAlias() }));
                notify(
                  "Novo apelido criado para suas próximas mensagens. As anteriores mantêm o apelido usado na época.",
                );
              }}
            >
              Gerar outro apelido para próximas mensagens
            </button>
          )}
        </details>
        {(forum.blockedAuthors.length > 0 || forum.reports.length > 0) && (
          <details>
            <summary>Conteúdos ocultados neste aparelho</summary>
            {forum.blockedAuthors.map((author) => (
              <div className="forum-hidden-row" key={author}>
                <span>{author} · bloqueado</span>
                <button
                  className="text-button"
                  onClick={() =>
                    updateForum((f) => ({
                      ...f,
                      blockedAuthors: f.blockedAuthors.filter(
                        (a) => a !== author,
                      ),
                    }))
                  }
                >
                  Desbloquear apelido
                </button>
              </div>
            ))}
            {forum.reports.map((r) => (
              <div className="forum-hidden-row" key={r.threadId}>
                <span>
                  {[...forum.threads, ...EXAMPLE_THREADS].find(
                    (t) => t.id === r.threadId,
                  )?.title || "Conversa"}
                  <small>{r.reason} · não enviado a moderação</small>
                </span>
                <button
                  className="text-button"
                  onClick={() =>
                    updateForum((f) => ({
                      ...f,
                      reports: f.reports.filter(
                        (x) => x.threadId !== r.threadId,
                      ),
                    }))
                  }
                >
                  Mostrar conversa novamente
                </button>
              </div>
            ))}
          </details>
        )}
      </section>
    </div>
  );
}
