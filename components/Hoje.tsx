"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCare } from "./CareProvider";
import Icon from "./Icon";
import { dateLabel, nextAppointment, recentDays, todayKey } from "@/lib/care";
export default function Today() {
  const { data, update, ready, notify } = useCare();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);
  if (!ready || !now)
    return <p role="status">Preparando seu espaço de cuidado…</p>;
  const today = todayKey(now);
  const checked = data.checkIns.some(
    (x) => todayKey(new Date(x.date)) === today,
  );
  const next = nextAppointment(data.appointments, now);
  const dose = data.doses[today];
  const days = recentDays(now);
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">SEU ESPAÇO DE CUIDADO</p>
          <h1>Um dia de cada vez.</h1>
          <p>O que você precisa para cuidar de você hoje?</p>
        </div>
        <span className="date-tag">
          {now.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
      </div>
      {!data.welcomed && (
        <section className="welcome card compact-welcome">
          <div>
            <h2>Seu cuidado começa com um pequeno passo.</h2>
            <p>
              Registre como está no cartão abaixo.{" "}
              {data.remember
                ? "Seus registros ficam neste navegador."
                : "Por padrão, os registros ficam só nesta aba."}{" "}
              <Link href="/ajustes">Escolher onde guardar meus registros</Link>
            </p>
          </div>
          <button
            className="text-button"
            onClick={() => update((d) => ({ ...d, welcomed: true }))}
          >
            Entendi
          </button>
        </section>
      )}
      <div className="dashboard-grid">
        <section className="daily-card">
          <div className="row">
            <span className="pill">SEU MOMENTO DE HOJE</span>
            <Icon name="heart" size={28} />
          </div>
          <h2>
            {checked
              ? "Seu registro de hoje está aqui."
              : "Como você está hoje?"}
          </h2>
          <p>
            {checked
              ? "Você pode voltar e anotar algo novo quando precisar."
              : "Uma pausa breve para perceber seu corpo e suas emoções."}
          </p>
          <Link href="/diario" className="button light">
            {checked ? "Ver ou acrescentar registro" : "Registrar como estou"}
            <Icon name="arrow" size={20} />
          </Link>
          <p className="small">Leva cerca de 1 minuto. Faça no seu tempo.</p>
          <div
            className="week-strip"
            aria-label="Dias com registro nesta semana"
          >
            {days.map((day) => {
              const done = data.checkIns.some(
                (x) => todayKey(new Date(x.date)) === day,
              );
              return (
                <div
                  key={day}
                  className={done ? "marked" : ""}
                  aria-label={`${dateLabel(day)}: ${done ? "com registro" : "sem registro"}`}
                >
                  <span>
                    {new Date(day + "T12:00:00")
                      .toLocaleDateString("pt-BR", { weekday: "short" })
                      .slice(0, 3)}
                  </span>
                  <span className="day-circle">
                    {done ? "✓" : new Date(day + "T12:00:00").getDate()}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="small">
            Cada registro ajuda a contar sua história. Não é preciso preencher
            todos os dias.
          </p>
        </section>
        <section className="card next-card">
          <div className="section-label">
            <Icon name="calendar" />
            <span>SUA AGENDA</span>
          </div>
          <h2>
            {next
              ? "Seu próximo compromisso"
              : "Sua próxima consulta, sem esquecer."}
          </h2>
          {next ? (
            <>
              <h3>{next.title}</h3>
              <p className="appointment-date">{dateLabel(next.date, true)}</p>
              {next.notes && <p>{next.notes}</p>}
            </>
          ) : (
            <p>
              Guarde a data e o que precisa levar. Tudo fica junto para você
              consultar.
            </p>
          )}
          <Link className="button secondary" href="/agenda">
            {next ? "Ver minha agenda" : "Adicionar um compromisso"}
            <Icon name="arrow" size={18} />
          </Link>
          <Link className="inline-link" href="/relatorio-print">
            Preparar resumo para a consulta
          </Link>
        </section>
      </div>
      {data.medication ? (
        <section className="card">
          <div className="section-label">
            <Icon name="check" />
            <span>SEU REGISTRO DE MEDICAMENTO</span>
          </div>
          <h2>{data.medication}</h2>
          <p>{data.schedule}</p>
          <p>
            Registre apenas o que aconteceu hoje. Siga a orientação da sua
            equipe de saúde.
          </p>
          <div className="actions">
            <button
              className={`button ${dose === "taken" ? "" : "secondary"}`}
              aria-pressed={dose === "taken"}
              onClick={() => {
                update((d) => ({
                  ...d,
                  doses: { ...d.doses, [today]: "taken" },
                }));
                notify("Tomada de hoje registrada por você.");
              }}
            >
              {dose === "taken" ? "✓ " : ""}Já tomei hoje
            </button>
            <button
              className="button secondary"
              aria-pressed={dose === "not-taken"}
              onClick={() => {
                update((d) => ({
                  ...d,
                  doses: { ...d.doses, [today]: "not-taken" },
                }));
                notify(
                  "Registrado como não tomado hoje. Dúvidas sobre doses devem ser conversadas com a equipe.",
                );
              }}
            >
              Não tomei hoje
            </button>
            {dose && (
              <button
                className="text-button"
                onClick={() =>
                  update((d) => {
                    const doses = { ...d.doses };
                    delete doses[today];
                    return { ...d, doses };
                  })
                }
              >
                Desfazer registro de hoje
              </button>
            )}
          </div>
          <p className="small">
            Este registro não confirma ingestão nem substitui orientação sobre
            doses.
          </p>
        </section>
      ) : (
        <Link className="card feature-link" href="/ajustes">
          <span className="icon-tile">
            <Icon name="settings" />
          </span>
          <span>
            <strong>Usa algum medicamento contínuo?</strong>
            <span>Se quiser, configure um registro da sua rotina.</span>
          </span>
          <Icon name="arrow" />
        </Link>
      )}
      <div className="two-columns">
        <Link className="card feature-link" href="/aprender">
          <span className="icon-tile">
            <Icon name="book" />
          </span>
          <span>
            <strong>Informação para o seu momento</strong>
            <span>Orientações curtas, com fontes para consultar.</span>
          </span>
          <Icon name="arrow" />
        </Link>
        <Link className="card feature-link" href="/comunidade">
          <span className="icon-tile">
            <Icon name="users" />
          </span>
          <span>
            <strong>Encontrar apoio</strong>
            <span>Prepare uma conversa e conheça opções de suporte.</span>
          </span>
          <Icon name="arrow" />
        </Link>
      </div>
      <p className="safety-note">
        Os registros não são acompanhados por profissionais. Se precisar de
        ajuda, entre em contato com seu serviço de saúde. Em uma emergência,
        ligue 192.
      </p>
    </div>
  );
}
