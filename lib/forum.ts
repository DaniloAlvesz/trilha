export const FORUM_CATEGORIES = [
  "Dia a dia",
  "Emoções e apoio",
  "Tratamento e consultas",
  "Corpo e sexualidade",
  "Câncer de mama em homens",
] as const;
export type ForumCategory = (typeof FORUM_CATEGORIES)[number];
export type ForumThread = {
  id: string;
  title: string;
  body: string;
  category: ForumCategory;
  author: string;
  createdAt: string;
};
export type ForumReply = {
  id: string;
  threadId: string;
  author: string;
  body: string;
  createdAt: string;
};
export type ForumReport = { threadId: string; reason: string };
export type ForumState = {
  alias: string;
  threads: ForumThread[];
  replies: ForumReply[];
  saved: string[];
  supported: string[];
  blockedAuthors: string[];
  reports: ForumReport[];
};
export const EXAMPLE_THREADS: ForumThread[] = [
  {
    id: "example-apoio",
    title: "Como pedir companhia para uma consulta?",
    body: "Conversa fictícia para conhecer o fórum: às vezes é difícil explicar que gostaríamos de companhia. Que palavras você usaria para pedir esse apoio a alguém de confiança?",
    category: "Emoções e apoio",
    author: "Lavanda · exemplo",
    createdAt: "",
  },
  {
    id: "example-rotina",
    title: "O que ajuda você a lembrar das suas dúvidas?",
    body: "Conversa fictícia: anotar uma pergunta assim que ela surge pode ajudar a preparar a próxima consulta. Como você prefere organizar o que quer conversar com a equipe?",
    category: "Dia a dia",
    author: "Jasmim · exemplo",
    createdAt: "",
  },
  {
    id: "example-homens",
    title: "Um espaço para homens com câncer de mama também",
    body: "Conversa fictícia: homens podem sentir falta de informações e de espaços de acolhimento sobre câncer de mama. Que tema você gostaria de encontrar por aqui?",
    category: "Câncer de mama em homens",
    author: "Ipê · exemplo",
    createdAt: "",
  },
];
export function emptyForum(): ForumState {
  return {
    alias: "",
    threads: [],
    replies: [],
    saved: [],
    supported: [],
    blockedAuthors: [],
    reports: [],
  };
}
export function newForumAlias(): string {
  const names = [
    "Jasmim",
    "Lavanda",
    "Ipê",
    "Camélia",
    "Oliveira",
    "Lótus",
    "Acácia",
    "Magnólia",
  ];
  const values = crypto.getRandomValues(new Uint32Array(2));
  return `${names[values[0] % names.length]}-${100 + (values[1] % 900)}`;
}
export function isExampleThread(id: string): boolean {
  return EXAMPLE_THREADS.some((t) => t.id === id);
}
// Treat browser data as untrusted, and do not let it insert HTML or unbounded content.
export function readForum(value: unknown): ForumState {
  if (!value || typeof value !== "object") return emptyForum();
  const d = value as Record<string, unknown>;
  const str = (s: unknown, max: number): s is string =>
    typeof s === "string" && s.length <= max;
  const validDate = (s: unknown): s is string =>
    str(s, 40) && !Number.isNaN(Date.parse(s));
  const strings = (v: unknown) =>
    Array.isArray(v)
      ? v.filter((s): s is string => str(s, 100)).slice(0, 1000)
      : [];
  const threads = Array.isArray(d.threads)
    ? d.threads
        .filter((v): v is ForumThread => {
          if (!v || typeof v !== "object") return false;
          const x = v as ForumThread;
          return (
            str(x.id, 100) &&
            !isExampleThread(x.id) &&
            str(x.title, 100) &&
            str(x.body, 2000) &&
            FORUM_CATEGORIES.includes(x.category) &&
            str(x.author, 60) &&
            validDate(x.createdAt)
          );
        })
        .slice(0, 100)
    : [];
  const threadIds = new Set([...EXAMPLE_THREADS, ...threads].map((t) => t.id));
  const replies = Array.isArray(d.replies)
    ? d.replies
        .filter((v): v is ForumReply => {
          if (!v || typeof v !== "object") return false;
          const x = v as ForumReply;
          return (
            str(x.id, 100) &&
            threadIds.has(x.threadId) &&
            str(x.author, 60) &&
            str(x.body, 2000) &&
            validDate(x.createdAt)
          );
        })
        .slice(0, 500)
    : [];
  const reports = Array.isArray(d.reports)
    ? d.reports
        .filter((v): v is ForumReport => {
          if (!v || typeof v !== "object") return false;
          const x = v as ForumReport;
          return threadIds.has(x.threadId) && str(x.reason, 100);
        })
        .slice(0, 100)
    : [];
  return {
    alias: str(d.alias, 60) ? d.alias : "",
    threads,
    replies,
    saved: strings(d.saved).filter((id) => threadIds.has(id)),
    supported: strings(d.supported).filter((id) => threadIds.has(id)),
    blockedAuthors: strings(d.blockedAuthors),
    reports,
  };
}
