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
    <div className="page-stack home-page">
      <div className="home-heading">
        <div>
          <h1>Seu cuidado hoje</h1>
          <p>Um passo de cada vez, no seu tempo.</p>
        </div>
        <time dateTime={today}>
          {now.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
        </time>
      </div>
      <section className="daily-card" aria-labelledby="daily-title">
        <div className="daily-title-row">
          <h2 id="daily-title">
            {checked ? "Você já registrou seu dia." : "Como você está hoje?"}
          </h2>
          <Icon name={checked ? "check" : "heart"} size={24} />
        </div>
        <p>
          {checked
            ? "Se algo mudou, você pode anotar de novo."
            : "Conte como estão seu corpo e suas emoções."}
        </p>
        <Link className="button" href="/diario">
          {checked ? "Ver meu diário" : "Registrar meu dia"}
          <Icon name="arrow" size={20} />
        </Link>
        <span className="small">Cerca de 1 minuto. Sem pressa.</span>
      </section>
      <section className="today-agenda" aria-labelledby="next-title">
        <div className="section-heading">
          <h2 id="next-title">Próximo compromisso</h2>
          <Link href="/agenda" className="text-link">
            Ver agenda
          </Link>
        </div>
        {next ? (
          <Link className="appointment-preview" href="/agenda">
            <Icon name="calendar" />
            <span>
              <strong>{next.title}</strong>
              <time dateTime={next.date}>{dateLabel(next.date, true)}</time>
            </span>
            <Icon name="arrow" size={20} />
          </Link>
        ) : (
          <div className="agenda-empty">
            <p>Nenhum compromisso adicionado.</p>
            <Link href="/agenda" className="inline-link">
              Adicionar consulta ou exame <Icon name="plus" size={18} />
            </Link>
          </div>
        )}
      </section>
      {data.medication && (
        <section className="routine-panel" aria-labelledby="med-title">
          <h2 id="med-title">Meu medicamento hoje</h2>
          <strong className="routine-name">{data.medication}</strong>
          {data.schedule && <p>{data.schedule}</p>}
          <div className="actions">
            <button
              className="button secondary"
              aria-pressed={dose === "taken"}
              onClick={() => {
                update((d) => ({
                  ...d,
                  doses: { ...d.doses, [today]: "taken" },
                }));
                notify("Tomada de hoje registrada por você.");
              }}
            >
              {dose === "taken" && <Icon name="check" size={18} />}Já tomei
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
                  "Registrado como não tomado hoje. Converse com a equipe se tiver dúvidas sobre doses.",
                );
              }}
            >
              {dose === "not-taken" && <Icon name="check" size={18} />}Não tomei
            </button>
          </div>
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
              Desfazer registro
            </button>
          )}
          <p className="small">
            Siga a prescrição da sua equipe. Este registro não confirma
            ingestão.
          </p>
        </section>
      )}
      <section className="home-resources" aria-labelledby="resources-title">
        <h2 id="resources-title">Para ajudar no seu dia</h2>
        <div className="resource-list">
          <Link href="/relatorio-print" className="resource-row">
            <Icon name="diary" />
            <span>
              <strong>Preparar minha consulta</strong>
              <span>Guardar dúvidas e levar meu resumo</span>
            </span>
            <Icon name="arrow" size={18} />
          </Link>
          <Link href="/comunidade" className="resource-row">
            <Icon name="users" />
            <span>
              <strong>Fórum anônimo</strong>
              <span>Conversar sem mostrar meu nome</span>
            </span>
            <Icon name="arrow" size={18} />
          </Link>
          <Link href="/aprender" className="resource-row">
            <Icon name="book" />
            <span>
              <strong>Orientações de saúde</strong>
              <span>Informação simples, com fontes</span>
            </span>
            <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <details className="week-details">
        <summary>Ver meus registros da semana</summary>
        <div
          className="week-strip"
          aria-label="Dias com registro nos últimos sete dias"
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
                  {done ? (
                    <Icon name="check" size={16} />
                  ) : (
                    new Date(day + "T12:00:00").getDate()
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <p className="small">
          Dias sem registro não são falhas. Use o diário quando ajudar você.
        </p>
      </details>
      {!data.remember && (
        <p className="storage-hint">
          Quer encontrar seus registros amanhã?{" "}
          <Link href="/ajustes">Escolher onde guardar</Link>.
        </p>
      )}
      <p className="home-safety">
        Os registros não são acompanhados por profissionais.{" "}
        <Link href="/ajuda">Como buscar ajuda</Link>.
      </p>
    </div>
  );
}
