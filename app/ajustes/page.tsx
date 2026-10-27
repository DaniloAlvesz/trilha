"use client";
import { useState } from "react";
import Link from "next/link";
import { useCare } from "@/components/CareProvider";
import { calendarFile, todayKey } from "@/lib/care";
export default function Settings() {
  const { data, update, ready, notify, clear } = useCare();
  const [medication, setMedication] = useState(data.medication);
  const [schedule, setSchedule] = useState(data.schedule);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [changeMed, setChangeMed] = useState(false);
  const [time, setTime] = useState(data.reminderTime);
  function saveMedication() {
    update((d) => ({
      ...d,
      medication: medication.trim(),
      schedule: schedule.trim(),
      doses: medication.trim() !== d.medication ? {} : d.doses,
    }));
    setEditing(false);
    setChangeMed(false);
    notify(
      "Rotina atualizada. Siga sempre a prescrição da sua equipe de saúde.",
    );
  }
  function reminder() {
    const d = new Date();
    const [h, m] = time.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    if (d <= new Date()) d.setDate(d.getDate() + 1);
    const local = `${todayKey(d)}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    let ics = calendarFile({
      id: crypto.randomUUID(),
      title: "",
      date: local,
      notes: "",
      done: false,
    })
      .replace("SUMMARY:Compromisso pessoal", "SUMMARY:Um momento para você")
      .replace("BEGIN:VALARM", "RRULE:FREQ=DAILY\r\nBEGIN:VALARM")
      .replace("TRIGGER:-PT1H", "TRIGGER:PT0M")
      .replace(
        "Você tem um compromisso em 1 hora.",
        "Seu momento de registro está disponível.",
      );
    const url = URL.createObjectURL(
      new Blob([ics], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "onco-mais-lembrete-diario.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    update((d) => ({ ...d, reminderTime: time }));
    notify(
      "Abra o arquivo no calendário e confirme o lembrete diário. Para pausar ou excluir, use o calendário onde importou.",
    );
  }
  return (
    <div className="page-stack">
      <Link className="back-link" href="/ajuda">
        ← Voltar para Mais
      </Link>
      <div className="page-heading">
        <div>
          <h1>Seus dados e preferências</h1>
          <p>Você escolhe o que registrar e como usar o ONCO+.</p>
        </div>
      </div>
      <section className="card form-stack">
        <h2>Onde ficam os meus registros?</h2>
        <p>
          Este protótipo não tem conta, servidor de registros ou equipe de
          monitoramento. Sem a opção abaixo, os registros ficam na memória desta
          aba e são perdidos ao atualizar ou fechar.
        </p>
        <label className="check-label">
          <input
            type="checkbox"
            disabled={!ready}
            checked={data.remember}
            onChange={(e) => {
              const remember = e.target.checked;
              update((d) => ({ ...d, remember }));
              notify(
                remember
                  ? "O app tentará guardar os registros neste navegador. Veja abaixo os cuidados em aparelhos compartilhados."
                  : "Armazenamento contínuo desativado. Os registros continuam só nesta aba.",
              );
            }}
          />
          <span>
            <strong>Manter meus registros neste navegador</strong>Ative apenas
            se este aparelho for de uso pessoal.
          </span>
        </label>
        <p className="small">
          Os registros não têm senha nem criptografia própria do ONCO+. Quem usa
          este navegador pode acessá-los. Não há cópia de segurança ou
          sincronização. Limpar os dados do navegador pode apagá-los. O acesso
          ao site ainda envolve a hospedagem e os registros técnicos normais de
          navegação.
        </p>
        <Link href="/relatorio-print">
          Salvar uma cópia do meu resumo em PDF
        </Link>
      </section>
      <section className="card">
        <h2>Leitura confortável</h2>
        <label className="check-label" style={{ marginTop: 16 }}>
          <input
            type="checkbox"
            checked={data.largeText}
            onChange={(e) =>
              update((d) => ({ ...d, largeText: e.target.checked }))
            }
          />
          <span>Aumentar o tamanho do texto</span>
        </label>
      </section>
      <section className="card">
        <h2>Minha rotina de medicamento (opcional)</h2>
        <p>
          Copie apenas o que foi orientado pela equipe de saúde. O aplicativo
          não indica medicamento, dose ou horário.
        </p>
        {!editing ? (
          <>
            <p>
              <strong>
                {data.medication || "Nenhum medicamento informado"}
              </strong>
            </p>
            {data.schedule && <p>{data.schedule}</p>}
            <button
              className="button secondary"
              style={{ marginTop: 16 }}
              onClick={() => {
                setMedication(data.medication);
                setSchedule(data.schedule);
                setEditing(true);
              }}
            >
              {data.medication
                ? "Editar minha rotina"
                : "Adicionar minha rotina"}
            </button>
          </>
        ) : (
          <form
            className="form-stack"
            style={{ marginTop: 20 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (
                medication.trim() !== data.medication &&
                Object.keys(data.doses).length
              ) {
                setChangeMed(true);
                return;
              }
              saveMedication();
            }}
          >
            <div>
              <label htmlFor="medication">Nome do medicamento</label>
              <input
                id="medication"
                maxLength={100}
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="schedule">Orientação recebida (opcional)</label>
              <input
                id="schedule"
                maxLength={100}
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Copie sua rotina conforme a prescrição"
              />
            </div>
            <div className="actions">
              <button className="button">Salvar rotina</button>
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setEditing(false);
                  setChangeMed(false);
                }}
              >
                Cancelar
              </button>
            </div>
            {changeMed && (
              <div className="info-note">
                <p>
                  Trocar ou remover o medicamento apaga os registros de tomada
                  anteriores para não misturar tratamentos. Salve seu resumo
                  antes, se precisar.
                </p>
                <button
                  type="button"
                  className="button danger"
                  onClick={saveMedication}
                >
                  Confirmar troca e apagar tomadas anteriores
                </button>
              </div>
            )}
          </form>
        )}
      </section>
      <section className="card form-stack">
        <h2>Um lembrete diário, se ajudar</h2>
        <p>
          Escolha um horário confortável. O lembrete abre no calendário do
          celular; você precisa confirmar a importação. Não é um lembrete de
          dose.
        </p>
        <div>
          <label htmlFor="reminder-time">
            Horário para meu momento de registro
          </label>
          <input
            id="reminder-time"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button
          className="button secondary"
          disabled={!/^\d{2}:\d{2}$/.test(time)}
          onClick={reminder}
        >
          Criar lembrete no meu calendário
        </button>
        <p className="small">
          O título será “Um momento para você”, sem mencionar câncer. Para
          mudar, pausar ou excluir, abra o calendário onde importou. Importar
          várias vezes pode criar lembretes repetidos.
        </p>
      </section>
      <section className="card">
        <h2>Apagar meus registros</h2>
        <p>
          Apaga diário, agenda, dúvidas, fotos, conversas do fórum, rotina e
          preferências deste navegador. Arquivos PDF e lembretes já exportados
          precisam ser apagados onde foram salvos.
        </p>
        {!confirm ? (
          <button
            className="button danger"
            style={{ marginTop: 16 }}
            onClick={() => setConfirm(true)}
          >
            Quero apagar meus registros
          </button>
        ) : (
          <div className="info-note" style={{ marginTop: 16 }}>
            <p>Esta exclusão não pode ser desfeita neste aplicativo.</p>
            <div className="actions">
              <button
                className="button danger"
                onClick={() => {
                  clear();
                  setConfirm(false);
                  setEditing(false);
                }}
              >
                Sim, apagar todos os registros
              </button>
              <button
                className="button secondary"
                onClick={() => setConfirm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
