"use client";

import React, { useState } from "react";
import { EncounterResource } from "@/types/clinical";

export default function AgendaPage() {
  const [encounters, setEncounters] = useState<EncounterResource[]>([
    {
      resourceType: "Encounter",
      id: "enc-001",
      status: "planned",
      class: "ambulatory",
      type: "MAMOGRAFIA DIGITAL DE CONTROLE (BILATERAL)",
      periodStart: "2026-09-14T08:30:00-03:00",
      title: "EXAME DE IMAGEM ANUAL",
      notes: "JEJUM NÃO OBRIGATÓRIO. LEVAR EXAMES ANTERIORES PARA COMPARAÇÃO.",
    },
    {
      resourceType: "Encounter",
      id: "enc-002",
      status: "planned",
      class: "ambulatory",
      type: "CONSULTA ONCOLÓGICA DE SEGUIMENTO (RETORNO)",
      periodStart: "2026-09-17T14:00:00-03:00",
      title: "AVALIAÇÃO DE HORMONIOTERAPIA (ANO 2)",
      notes: "APRESENTAR RESULTADOS DO EXAME DE MAMOGRAFIA E RELATÓRIO DO TRILHA.",
    },
    {
      resourceType: "Encounter",
      id: "enc-003",
      status: "finished",
      class: "ambulatory",
      type: "FISIOTERAPIA LINFÁTICA",
      periodStart: "2026-08-20T10:00:00-03:00",
      title: "DRENAGEM LINFÁTICA DE MANUTENÇÃO",
      notes: "MEDIDAS DA CIRCUNFERÊNCIA DO BRAÇO ESQUERDO ESTÁVEIS.",
    },
  ]);

  const [novoTipo, setNovoTipo] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaNota, setNovaNota] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "planned" | "finished">("todos");
  const [statusFeedback, setStatusFeedback] = useState<string>("");

  const handleSalvarEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTipo.trim() || !novaData) {
      setStatusFeedback("Por favor, preencha o nome do compromisso e a data");
      return;
    }

    const novoId = `enc-${Date.now()}`;
    const novoEncounter: EncounterResource = {
      resourceType: "Encounter",
      id: novoId,
      title: novoTipo.trim(),
      status: "planned",
      class: "ambulatory",
      type: novoTipo.trim(),
      periodStart: new Date(novaData).toISOString(),
      notes: novaNota.trim() || undefined,
    };

    setEncounters([novoEncounter, ...encounters]);
    setNovoTipo("");
    setNovaData("");
    setNovaNota("");
    setStatusFeedback("Seu compromisso foi agendado com sucesso!");
  };

  const listaFiltrada = encounters.filter((enc) => {
    if (filtroStatus === "todos") return true;
    return enc.status === filtroStatus;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho Acolhedor */}
      <section className="bg-clinical-paper border border-clinical-ink/20 rounded-2xl p-5 sm:p-6 shadow-sm">
        <span className="font-sans text-xs sm:text-sm font-semibold text-clinical-action block">
          Organização do seu cuidado médico
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clinical-ink mt-0.5">
          Minhas Consultas e Compromissos
        </h1>
        <p className="font-sans text-sm sm:text-base text-clinical-ink/80 mt-1 leading-relaxed">
          Tenha em mãos suas datas de retorno, sessões de fisioterapia e exames de controle. Estar em dia com os seus compromissos é uma forma importante de cuidar de você.
        </p>
      </section>

      {/* Formulário de Novo Compromisso */}
      <section className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink border-b border-clinical-ink/15 pb-3">
          Agendar nova consulta ou exame
        </h2>
        <form onSubmit={handleSalvarEncounter} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipo-evento" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                Qual é o compromisso?
              </label>
              <input
                id="tipo-evento"
                type="text"
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value)}
                placeholder="Ex: Consulta com oncologista, Mamografia, Fisioterapia..."
                className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                required
              />
            </div>
            <div>
              <label htmlFor="data-evento" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                Data e horário:
              </label>
              <input
                id="data-evento"
                type="datetime-local"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="notas-evento" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
              Orientações ou lembretes (documentos para levar, preparo - opcional):
            </label>
            <input
              id="notas-evento"
              type="text"
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              placeholder="Ex: Levar cartão do SUS e exames anteriores de sangue..."
              className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-7 rounded-xl bg-clinical-action text-white font-sans text-sm sm:text-base font-bold hover:bg-clinical-ink transition-all shadow-sm text-center"
          >
            Salvar compromisso na agenda
          </button>
        </form>
      </section>

      {/* Controles de Filtro de Lista */}
      <section className="flex flex-wrap gap-2 items-center">
        <span className="font-sans text-xs sm:text-sm font-bold text-clinical-ink w-full sm:w-auto mb-1 sm:mb-0">
          Mostrar:
        </span>
        <button
          type="button"
          onClick={() => setFiltroStatus("todos")}
          className={`min-h-[42px] px-4 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            filtroStatus === "todos"
              ? "bg-clinical-action text-white"
              : "bg-white text-clinical-ink border border-clinical-ink/20 hover:bg-clinical-paper"
          }`}
        >
          Todos os compromissos
        </button>
        <button
          type="button"
          onClick={() => setFiltroStatus("planned")}
          className={`min-h-[42px] px-4 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            filtroStatus === "planned"
              ? "bg-clinical-action text-white"
              : "bg-white text-clinical-ink border border-clinical-ink/20 hover:bg-clinical-paper"
          }`}
        >
          Agendados
        </button>
        <button
          type="button"
          onClick={() => setFiltroStatus("finished")}
          className={`min-h-[42px] px-4 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            filtroStatus === "finished"
              ? "bg-clinical-action text-white"
              : "bg-white text-clinical-ink border border-clinical-ink/20 hover:bg-clinical-paper"
          }`}
        >
          Realizados
        </button>
      </section>

      {/* Lista de Compromissos Acolhedora */}
      <section className="space-y-4">
        {listaFiltrada.length === 0 ? (
          <div className="rounded-2xl border border-clinical-ink/20 p-6 sm:p-8 bg-white text-center font-sans text-base font-medium text-clinical-ink/70 shadow-sm">
            Nenhum compromisso encontrado nesta seleção.
          </div>
        ) : (
          listaFiltrada.map((enc) => {
            const dataObj = new Date(enc.periodStart);
            const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
            const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article
                key={enc.id}
                className="rounded-2xl border border-clinical-ink/20 bg-white p-4 sm:p-5 space-y-3 shadow-sm"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-clinical-ink/15 pb-2.5 gap-2">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-clinical-ink break-words">
                      {enc.type}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-sans text-xs sm:text-sm">
                    <span className={`px-3 py-1 rounded-full font-semibold shadow-sm ${
                      enc.status === "finished" ? "bg-clinical-success text-white" : "bg-clinical-surface text-clinical-ink"
                    }`}>
                      {enc.status === "finished" ? "✓ Realizado" : "Agendado"}
                    </span>
                    <span className="px-3 py-1 bg-clinical-paper text-clinical-ink rounded-full border border-clinical-ink/20 font-medium">
                      📅 {dataFormatada} às {horaFormatada}
                    </span>
                  </div>
                </div>

                {enc.notes && (
                  <p className="font-sans text-sm sm:text-base bg-clinical-paper rounded-xl p-3 border border-clinical-ink/10 text-clinical-ink leading-relaxed">
                    <strong className="text-clinical-action">Lembrete:</strong> {enc.notes}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-clinical-ink/10">
                  {enc.status === "planned" && (
                    <button
                      type="button"
                      onClick={() => {
                        setEncounters(
                          encounters.map((item) =>
                            item.id === enc.id ? { ...item, status: "finished" } : item
                          )
                        );
                        setStatusFeedback("Compromisso marcado como realizado!");
                      }}
                      className="w-full sm:w-auto min-h-[42px] px-5 rounded-xl bg-clinical-success text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-ink transition-all shadow-sm text-center"
                    >
                      Marcar como realizado ✓
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
