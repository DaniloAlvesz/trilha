"use client";
import { useState } from "react";
import { useCare } from "@/components/CareProvider";
import { dateLabel, doseSummary } from "@/lib/care";
export default function Report() {
  const { data, update, ready, notify } = useCare();
  const [question, setQuestion] = useState("");
  const totals = doseSummary(data.doses);
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PARA LEVAR COM VOCÊ</p>
          <h1>Preparar minha consulta</h1>
          <p>Guarde suas dúvidas e leve um resumo do que você registrou.</p>
        </div>
      </div>
      <section className="card no-print">
        <h2>O que você quer perguntar?</h2>
        <form
          className="form-stack"
          style={{ marginTop: 16 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!question.trim()) return;
            update((d) => ({
              ...d,
              questions: [
                ...d.questions,
                { id: crypto.randomUUID(), text: question.trim() },
              ],
            }));
            setQuestion("");
            notify("Dúvida adicionada ao resumo.");
          }}
        >
          <div>
            <label htmlFor="question">
              Minha dúvida para a equipe de saúde
            </label>
            <textarea
              id="question"
              required
              maxLength={500}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Por exemplo: o que devo fazer se o cansaço continuar?"
            />
          </div>
          <button className="button" disabled={!ready}>
            Guardar dúvida
          </button>
        </form>
      </section>
      <div className="actions no-print">
        <button className="button" onClick={() => window.print()}>
          Imprimir ou salvar resumo em PDF
        </button>
        <p className="small">
          Na janela de impressão, escolha sua impressora ou “Salvar como PDF”.
        </p>
      </div>
      <article className="report">
        <p className="eyebrow">ONCO+ · RESUMO PESSOAL</p>
        <h1>Registros para conversar na consulta</h1>
        <p>Emitido em {ready ? dateLabel(new Date().toISOString()) : "…"}</p>
        <p className="small">
          Informações registradas pela pessoa usuária. Não é prontuário, laudo,
          receita ou documento oficial do SUS. Não houve verificação por
          profissional de saúde.
        </p>
        <section>
          <h2>1. Minhas dúvidas</h2>
          {!data.questions.length ? (
            <p>Nenhuma dúvida adicionada.</p>
          ) : (
            <ul>
              {data.questions.map((q) => (
                <li key={q.id}>
                  <span className="pre-wrap">{q.text}</span>
                  <button
                    className="text-button no-print"
                    aria-label={`Remover dúvida: ${q.text}`}
                    onClick={() => {
                      update((d) => ({
                        ...d,
                        questions: d.questions.filter((x) => x.id !== q.id),
                      }));
                      notify("Dúvida removida.");
                    }}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2>2. Como me senti</h2>
          {!data.checkIns.length ? (
            <p>Nenhum registro no diário.</p>
          ) : (
            data.checkIns.map((x) => (
              <div className="record" key={x.id}>
                <strong>
                  {dateLabel(x.date, true)} · {x.symptom}
                </strong>
                <p>
                  {x.mood}
                  {x.intensity
                    ? ` · Intensidade: ${["", "leve", "moderada", "forte", "muito forte"][x.intensity]}`
                    : ""}
                </p>
                {x.note && <p>{x.note}</p>}
              </div>
            ))
          )}
        </section>
        <section>
          <h2>3. Medicamento e registros de tomada</h2>
          {data.medication ? (
            <>
              <p>
                Nome informado: <strong>{data.medication}</strong>
              </p>
              <p>Rotina informada: {data.schedule || "Não preenchida"}</p>
              <p>
                {totals.taken} dia(s) com tomada registrada; {totals.notTaken}{" "}
                dia(s) registrado(s) como não tomado.
              </p>
              <p className="small">
                Datas sem registro não foram classificadas como doses
                esquecidas. Estes dados não comprovam ingestão. Incluem todos os
                registros feitos neste navegador.
              </p>
              {Object.entries(data.doses)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([day, status]) => (
                  <p key={day}>
                    {dateLabel(day)}:{" "}
                    {status === "taken"
                      ? "tomada registrada"
                      : "registrado como não tomado"}
                  </p>
                ))}
            </>
          ) : (
            <p>Nenhum medicamento informado.</p>
          )}
        </section>
        <section>
          <h2>4. Compromissos</h2>
          {!data.appointments.length ? (
            <p>Nenhum compromisso registrado.</p>
          ) : (
            [...data.appointments]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((x) => (
                <div className="record" key={x.id}>
                  <strong>{x.title}</strong>
                  <p>
                    {dateLabel(x.date, true)} ·{" "}
                    {x.done
                      ? "Realizado, conforme registro"
                      : "Pendente de confirmação"}
                  </p>
                  {x.notes && <p>{x.notes}</p>}
                </div>
              ))
          )}
        </section>
        <section>
          <p className="small">
            Fotos não são incluídas neste resumo. Compartilhe o documento
            somente com quem você escolher. A ausência de registros não permite
            concluir que não há sintomas ou que o tratamento foi seguido.
          </p>
        </section>
      </article>
    </div>
  );
}
