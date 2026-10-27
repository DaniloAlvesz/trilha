"use client";
import { useState } from "react";
import Link from "next/link";
import { useCare } from "@/components/CareProvider";
import { calendarFile, dateLabel, type Appointment } from "@/lib/care";
export default function Agenda() {
  const { data, update, ready, notify } = useCare();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [remove, setRemove] = useState("");
  const [error, setError] = useState("");
  function save(e: React.FormEvent) {
    e.preventDefault();
    const values = new FormData(e.currentTarget as HTMLFormElement);
    const eventDate = String(values.get("date") || "");
    if (!title.trim() || !eventDate || isNaN(Date.parse(eventDate))) {
      setError("Informe o compromisso e uma data válida.");
      return;
    }
    update((d) => ({
      ...d,
      appointments: [
        ...d.appointments,
        {
          id: crypto.randomUUID(),
          title: title.trim(),
          date: eventDate,
          notes: notes.trim(),
          done: false,
        },
      ],
    }));
    setTitle("");
    setDate("");
    setNotes("");
    setError("");
    notify(
      "Compromisso salvo. Se quiser um aviso, adicione ao calendário do celular.",
    );
  }
  function download(item: Appointment) {
    const url = URL.createObjectURL(
      new Blob([calendarFile(item)], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "onco-mais-compromisso.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(
      "Arquivo de calendário preparado. Abra no calendário do seu aparelho e confirme a importação.",
    );
  }
  const items = [...data.appointments]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter(
      (x) => filter === "Todos" || (filter === "Realizados" ? x.done : !x.done),
    );
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ORGANIZE SEU CUIDADO</p>
          <h1>Minha agenda</h1>
          <p>Consultas, exames e outros compromissos em um só lugar.</p>
        </div>
      </div>
      <form className="card form-stack" onSubmit={save}>
        <h2>Adicionar um compromisso</h2>
        <div>
          <label htmlFor="appointment-title">Qual é o compromisso?</label>
          <input
            id="appointment-title"
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Por exemplo: consulta de retorno"
          />
        </div>
        <div>
          <label htmlFor="appointment-date">Data e horário</label>
          <input
            id="appointment-date"
            name="date"
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="appointment-notes">
            O que precisa lembrar ou levar? (opcional)
          </label>
          <textarea
            id="appointment-notes"
            maxLength={2000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anote apenas as orientações recebidas do serviço de saúde."
          />
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button disabled={!ready} className="button">
          Salvar compromisso
        </button>
      </form>
      <section className="card">
        <h2>Meus compromissos</h2>
        <div
          className="subnav"
          style={{ marginTop: 16 }}
          aria-label="Filtrar compromissos"
        >
          {["Todos", "Pendentes", "Realizados"].map((f) => (
            <button
              key={f}
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        {!items.length && (
          <div className="empty">
            <p>
              Nenhum compromisso nesta lista. Ao adicionar uma data, ela também
              aparece no seu resumo para consulta.
            </p>
          </div>
        )}
        {items.map((x) => (
          <article key={x.id} className="record">
            <span className="small">
              {x.done
                ? "✓ Realizado"
                : new Date(x.date).getTime() < Date.now()
                  ? "Data passada · confirme se aconteceu"
                  : "Agendado"}
            </span>
            <h3>{x.title}</h3>
            <p>
              <time dateTime={x.date}>{dateLabel(x.date, true)}</time>
            </p>
            {x.notes && <p>{x.notes}</p>}
            <div className="actions">
              <button
                className="button secondary"
                onClick={() =>
                  update((d) => ({
                    ...d,
                    appointments: d.appointments.map((a) =>
                      a.id === x.id ? { ...a, done: !a.done } : a,
                    ),
                  }))
                }
              >
                {x.done ? "Voltar para pendente" : "Marcar como realizado"}
              </button>
              {!x.done && (
                <button
                  className="button secondary"
                  onClick={() => download(x)}
                >
                  Adicionar ao calendário do celular
                </button>
              )}
              <button className="text-button" onClick={() => setRemove(x.id)}>
                Excluir compromisso
              </button>
            </div>
            {remove === x.id && (
              <div className="info-note">
                <p>Excluir “{x.title}”?</p>
                <div className="actions">
                  <button
                    className="button danger"
                    onClick={() => {
                      update((d) => ({
                        ...d,
                        appointments: d.appointments.filter(
                          (a) => a.id !== x.id,
                        ),
                      }));
                      setRemove("");
                      notify(
                        "Compromisso excluído do ONCO+. Se importou para outro calendário, exclua também lá.",
                      );
                    }}
                  >
                    Sim, excluir
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => setRemove("")}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
      <p className="info-note">
        O ONCO+ não envia avisos com o aplicativo fechado. Ao importar para o
        calendário, confira o horário e o lembrete. O arquivo usa o título
        discreto “Compromisso pessoal”, sem informações de saúde.
      </p>
      <Link className="button secondary" href="/relatorio-print">
        Ver resumo para consulta
      </Link>
    </div>
  );
}
