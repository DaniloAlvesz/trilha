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
  const [statusFeedback, setStatusFeedback] = useState<string>("[PRONTUÁRIO ATUALIZADO]");

  const handleSalvarEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTipo || !novaData) {
      setStatusFeedback("[ERRO: PREENCHIMENTO OBRIGATÓRIO DE TIPO E DATA]");
      return;
    }

    const novo: EncounterResource = {
      resourceType: "Encounter",
      id: `enc-${Date.now()}`,
      status: "planned",
      class: "ambulatory",
      type: novoTipo.toUpperCase(),
      periodStart: new Date(novaData).toISOString(),
      title: novoTipo.toUpperCase(),
      notes: novaNota ? novaNota.toUpperCase() : undefined,
    };

    setEncounters([novo, ...encounters]);
    setNovoTipo("");
    setNovaData("");
    setNovaNota("");
    setStatusFeedback("[REGISTRO ARQUIVADO: NOVO ENCOUNTER INSERIDO NO CALENDÁRIO CLÍNICO]");
  };

  const listaFiltrada = encounters.filter((enc) => {
    if (filtroStatus === "todos") return true;
    return enc.status === filtroStatus;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo */}
      <section className="border-b-4 border-clinical-ink pb-4">
        <span className="font-mono text-[10px] sm:text-xs uppercase font-bold text-clinical-action block">
          RECURSO OFICIAL: HL7 FHIR R4 // ENCOUNTER
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black uppercase break-words text-clinical-ink">
          MINHA AGENDA // COMPROMISSOS CLÍNICOS
        </h1>
        <div className="font-mono text-xs sm:text-sm uppercase text-clinical-ink font-bold mt-1 break-words">
          REGISTRO TEMPORAL IMUTÁVEL DE RETORNOS, EXAMES DE IMAGEM E PROCEDIMENTOS
        </div>
      </section>

      {/* Barra de Status do Sistema */}
      <div className="border-2 border-clinical-ink bg-clinical-ink text-white p-2.5 sm:p-3 font-mono text-xs sm:text-sm uppercase flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
        <span>ESTADO DA BASE DE DADOS:</span>
        <span className="text-clinical-surface font-bold break-words">{statusFeedback}</span>
      </div>

      {/* Formulário de Novo Encounter (Sem Modais) */}
      <section className="border-2 border-clinical-ink bg-clinical-paper p-4 sm:p-5 space-y-4">
        <h2 className="font-serif text-lg sm:text-xl font-black uppercase border-b-2 border-clinical-ink pb-2 text-clinical-ink">
          INSERIR NOVO EVENTO CLÍNICO (SEM OVERLAYS)
        </h2>
        <form onSubmit={handleSalvarEncounter} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipo-evento" className="block font-mono text-xs sm:text-sm font-bold uppercase mb-1 text-clinical-ink">
                TIPO DE ENCOUNTER (LOINC / PROCEDIMENTO):
              </label>
              <input
                id="tipo-evento"
                type="text"
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value)}
                placeholder="EX: MAMOGRAFIA, CONSULTA ONCOLÓGICA, EXAME DE SANGUE"
                className="w-full min-h-[48px] px-3 border-2 border-clinical-ink font-mono text-sm sm:text-base bg-white text-clinical-ink focus:outline-none focus:bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="data-evento" className="block font-mono text-xs sm:text-sm font-bold uppercase mb-1 text-clinical-ink">
                DATA E HORA DO EVENTO:
              </label>
              <input
                id="data-evento"
                type="datetime-local"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                className="w-full min-h-[48px] px-3 border-2 border-clinical-ink font-mono text-sm sm:text-base bg-white text-clinical-ink focus:outline-none focus:bg-white"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="notas-evento" className="block font-mono text-xs sm:text-sm font-bold uppercase mb-1 text-clinical-ink">
              OBSERVAÇÕES CLÍNICAS E LOGÍSTICAS (PREPARO, DOCUMENTOS):
            </label>
            <input
              id="notas-evento"
              type="text"
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              placeholder="EX: LEVAR CARTÃO DO SUS, EXAMES ANTERIORES E PROTOCOLO DE MEDICAMENTOS"
              className="w-full min-h-[48px] px-3 border-2 border-clinical-ink font-mono text-sm sm:text-base bg-white text-clinical-ink focus:outline-none focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-6 bg-clinical-action text-white font-mono text-sm sm:text-base font-black uppercase border-2 border-clinical-ink hover:bg-clinical-ink hover:text-white active:bg-clinical-paper active:text-clinical-ink transition-none text-center"
          >
            ARQUIVAR EVENTO NO PRONTUÁRIO
          </button>
        </form>
      </section>

      {/* Controles de Filtro de Lista (48px Touch Target) */}
      <section className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
        <span className="font-mono text-xs sm:text-sm font-black uppercase w-full sm:w-auto mb-1 sm:mb-0 text-clinical-ink">
          FILTRAR COMPETÊNCIA:
        </span>
        <button
          type="button"
          onClick={() => setFiltroStatus("todos")}
          className={`flex-1 sm:flex-none min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 font-mono text-xs sm:text-sm font-black uppercase border-2 border-clinical-ink transition-none text-center ${
            filtroStatus === "todos" ? "bg-clinical-ink text-white" : "bg-clinical-surface text-clinical-ink hover:bg-clinical-ink hover:text-white"
          }`}
        >
          TODOS OS REGISTROS
        </button>
        <button
          type="button"
          onClick={() => setFiltroStatus("planned")}
          className={`flex-1 sm:flex-none min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 font-mono text-xs sm:text-sm font-black uppercase border-2 border-clinical-ink transition-none text-center ${
            filtroStatus === "planned" ? "bg-clinical-ink text-white" : "bg-clinical-surface text-clinical-ink hover:bg-clinical-ink hover:text-white"
          }`}
        >
          PROGRAMADOS
        </button>
        <button
          type="button"
          onClick={() => setFiltroStatus("finished")}
          className={`flex-1 sm:flex-none min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 font-mono text-xs sm:text-sm font-black uppercase border-2 border-clinical-ink transition-none text-center ${
            filtroStatus === "finished" ? "bg-clinical-ink text-white" : "bg-clinical-surface text-clinical-ink hover:bg-clinical-ink hover:text-white"
          }`}
        >
          CONCLUÍDOS
        </button>
      </section>

      {/* Lista de Registros Clínicos / Encounters */}
      <section className="space-y-4">
        {listaFiltrada.length === 0 ? (
          <div className="border-4 border-clinical-ink p-6 sm:p-8 bg-white text-center font-mono text-base sm:text-lg font-black uppercase text-clinical-ink">
            [NENHUM EVENTO CLÍNICO REGISTRADO NESTA COMPETÊNCIA]
          </div>
        ) : (
          listaFiltrada.map((enc) => {
            const dataObj = new Date(enc.periodStart);
            const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article
                key={enc.id}
                className="border-2 border-clinical-ink bg-white p-3.5 sm:p-5 space-y-3"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-clinical-ink pb-2 gap-2">
                  <div>
                    <span className="font-mono text-[10px] sm:text-xs font-bold uppercase block text-clinical-ink/70">
                      ID: {enc.id} // CLASSE: {enc.class.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-black uppercase text-clinical-action break-words">
                      {enc.type}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm font-black">
                    <span className={`px-2 py-1 border-2 border-clinical-ink ${
                      enc.status === "finished" ? "bg-clinical-success text-white" : "bg-clinical-surface text-clinical-ink"
                    }`}>
                      STATUS: {enc.status.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-clinical-ink text-white border-2 border-clinical-ink">
                      {dataFormatada} • {horaFormatada}
                    </span>
                  </div>
                </div>

                {enc.notes && (
                  <p className="font-mono text-xs sm:text-base bg-clinical-paper border border-clinical-ink p-2.5 sm:p-3 font-bold break-words text-clinical-ink">
                    PRESCRIÇÃO / PREPARO: {enc.notes}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-clinical-ink">
                  {enc.status === "planned" && (
                    <button
                      type="button"
                      onClick={() => {
                        setEncounters(
                          encounters.map((item) =>
                            item.id === enc.id ? { ...item, status: "finished" } : item
                          )
                        );
                        setStatusFeedback(`[STATUS ATUALIZADO: ENCOUNTER ${enc.id} CONCLUÍDO]`);
                      }}
                      className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 bg-clinical-success text-white font-mono text-xs sm:text-sm font-bold uppercase border-2 border-clinical-ink hover:bg-clinical-ink hover:text-white transition-none text-center"
                    >
                      MARCAR COMO REALIZADO
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
