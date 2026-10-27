"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useCare } from "@/components/CareProvider";
import { dateLabel } from "@/lib/care";
const moods = [
  "Estou bem",
  "Com preocupação",
  "Com tristeza",
  "Com irritação",
  "Prefiro não responder",
];
const symptoms = [
  "Sem sintoma agora",
  "Cansaço",
  "Dor",
  "Inchaço no braço",
  "Ondas de calor",
  "Dificuldade para dormir",
  "Enjoo",
  "Outro sintoma",
];
const levels = ["Sem intensidade", "Leve", "Moderada", "Forte", "Muito forte"];
export default function Diary() {
  const { data, update, ready, notify } = useCare();
  const [mood, setMood] = useState("");
  const [symptom, setSymptom] = useState("");
  const [intensity, setIntensity] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [invalidGroup, setInvalidGroup] = useState("");
  const moodStart = useRef<HTMLButtonElement>(null);
  const symptomStart = useRef<HTMLButtonElement>(null);
  const intensityStart = useRef<HTMLButtonElement>(null);
  const [saved, setSaved] = useState(false);
  const [remove, setRemove] = useState("");
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!mood || !symptom || intensity === null) {
      const missing = !mood ? "mood" : !symptom ? "symptom" : "intensity";
      setInvalidGroup(missing);
      setError(
        missing === "mood"
          ? "Escolha uma opção na etapa 1: como estão suas emoções. Você pode escolher “Prefiro não responder”."
          : missing === "symptom"
            ? "Escolha uma opção na etapa 2: como está seu corpo. Se não há sintoma, escolha “Sem sintoma agora”."
            : "Escolha a intensidade do sintoma na etapa 3, de leve a muito forte.",
      );
      requestAnimationFrame(() => {
        const target =
          missing === "mood"
            ? moodStart
            : missing === "symptom"
              ? symptomStart
              : intensityStart;
        target.current?.focus();
      });
      return;
    }
    update((d) => ({
      ...d,
      welcomed: true,
      checkIns: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          mood,
          symptom,
          intensity,
          note: note.trim(),
        },
        ...d.checkIns,
      ],
    }));
    setSaved(true);
    setError("");
    setInvalidGroup("");
    setMood("");
    setSymptom("");
    setIntensity(null);
    setNote("");
    notify("Registro adicionado ao diário e ao resumo para consulta.");
  }
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <h1>Como você está?</h1>
          <p>
            Escolha as opções e toque em salvar. Você pode fazer mais de um
            registro no dia.
          </p>
        </div>
      </div>
      <p className="safety-note">
        Este diário não avalia a gravidade dos sintomas. Não espere registrar
        aqui para buscar ajuda. Em uma emergência, ligue 192.
      </p>
      {saved && (
        <div className="success" role="status">
          Registro salvo. Ele já faz parte do seu{" "}
          <Link href="/relatorio-print">resumo para consulta</Link>.
          {!data.remember && (
            <p>
              Quer encontrar este registro amanhã?{" "}
              <Link href="/ajustes">
                Escolha manter os registros neste navegador
              </Link>
              .
            </p>
          )}
        </div>
      )}
      <form
        className="card form-stack"
        onSubmit={save}
        aria-describedby="diary-instructions"
      >
        <p id="diary-instructions" className="field-hint">
          Responda às etapas 1 e 2. Se escolher um sintoma, informe também a
          intensidade na etapa 3. A anotação final é opcional.
        </p>
        <fieldset
          aria-invalid={invalidGroup === "mood" || undefined}
          aria-describedby={invalidGroup === "mood" ? "diary-error" : undefined}
        >
          <legend>1. Como estão suas emoções?</legend>
          <div className="choice-grid">
            {moods.map((m) => (
              <button
                type="button"
                key={m}
                ref={m === moods[0] ? moodStart : undefined}
                aria-pressed={mood === m}
                onClick={() => {
                  setMood(m);
                  setSaved(false);
                }}
              >
                {mood === m && <Icon name="check" size={18} />}
                {m}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset
          aria-invalid={invalidGroup === "symptom" || undefined}
          aria-describedby={
            invalidGroup === "symptom" ? "diary-error" : undefined
          }
        >
          <legend>2. Como está seu corpo agora?</legend>
          <div className="choice-grid">
            {symptoms.map((s) => (
              <button
                type="button"
                key={s}
                ref={s === symptoms[0] ? symptomStart : undefined}
                aria-pressed={symptom === s}
                onClick={() => {
                  setSymptom(s);
                  setIntensity(s === symptoms[0] ? 0 : null);
                  setSaved(false);
                }}
              >
                {symptom === s && <Icon name="check" size={18} />}
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        {symptom && symptom !== symptoms[0] && (
          <fieldset
            aria-invalid={invalidGroup === "intensity" || undefined}
            aria-describedby={
              invalidGroup === "intensity" ? "diary-error" : undefined
            }
          >
            <legend>3. Qual é a intensidade desse sintoma?</legend>
            <p className="field-hint">
              Escolha a opção que mais se aproxima do que você sente. Esta
              escala é apenas para seu registro pessoal.
            </p>
            <div className="choice-grid">
              {levels.slice(1).map((l, i) => (
                <button
                  type="button"
                  key={l}
                  ref={i === 0 ? intensityStart : undefined}
                  aria-pressed={intensity === i + 1}
                  onClick={() => setIntensity(i + 1)}
                >
                  {intensity === i + 1 && <Icon name="check" size={18} />}
                  {l}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <div>
          <label htmlFor="diary-note">
            Quer contar algo mais? <span className="muted">(opcional)</span>
          </label>
          <textarea
            id="diary-note"
            maxLength={2000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Por exemplo: quando começou ou o que atrapalhou no seu dia."
          />
        </div>
        {error && (
          <p id="diary-error" className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button" type="submit" disabled={!ready}>
          Salvar meu registro
        </button>
        <p className="small">
          {data.remember
            ? "Guardado neste navegador. Pessoas com acesso ao aparelho podem ver seus registros."
            : "Fica nesta aba. Para manter após fechá-la, veja “Seus dados” em Mais."}
        </p>
      </form>
      <section className="card">
        <h2>Seus registros anteriores</h2>
        {!data.checkIns.length && (
          <div className="empty">
            <p>
              Seu diário começa com o primeiro registro. Você pode registrar
              dias bons também.
            </p>
          </div>
        )}
        {data.checkIns.slice(0, 30).map((x) => (
          <article key={x.id} className="record">
            <div className="record-heading">
              <div>
                <time dateTime={x.date}>{dateLabel(x.date, true)}</time>
                <h3>
                  {x.symptom}
                  {x.intensity ? ` · ${levels[x.intensity]}` : ""}
                </h3>
              </div>
              <button className="text-button" onClick={() => setRemove(x.id)}>
                Excluir registro de {dateLabel(x.date, true)}
              </button>
            </div>
            <p>{x.mood}</p>
            {x.note && <p>{x.note}</p>}
            {remove === x.id && (
              <div className="info-note">
                <p>Excluir este registro do diário e do resumo?</p>
                <div className="actions">
                  <button
                    className="button danger"
                    onClick={() => {
                      update((d) => ({
                        ...d,
                        checkIns: d.checkIns.filter((r) => r.id !== x.id),
                      }));
                      setRemove("");
                      notify("Registro excluído.");
                    }}
                  >
                    Sim, excluir registro
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
        {data.checkIns.length > 30 && (
          <p className="small">
            Mostrando os 30 registros mais recentes. O resumo para consulta
            contém o histórico completo.
          </p>
        )}
      </section>
    </div>
  );
}
