"use client";

import React, { useState } from "react";
import { ObservationResource } from "@/types/clinical";

export default function DiarioPage() {
  const [observations, setObservations] = useState<ObservationResource[]>([
    {
      resourceType: "Observation",
      id: "obs-101",
      subjectId: "pat-uuid-001",
      categoryCode: "symptom",
      codeSystem: "LOINC",
      codeValue: "FADIGA INTENSA MATINAL",
      valueString: "Dificuldade severa para levantar da cama nas primeiras 2 horas.",
      effectiveDateTime: "2026-09-10T08:15:00-03:00",
    },
    {
      resourceType: "Observation",
      id: "obs-102",
      subjectId: "pat-uuid-001",
      categoryCode: "symptom",
      codeSystem: "SNOMED-CT",
      codeValue: "INCHAÇO E PESO NO BRAÇO ESQUERDO",
      valueString: "Sensação de aperto ao usar manga de camisa justa. Linfedema subclínico suspeito.",
      effectiveDateTime: "2026-09-08T17:30:00-03:00",
    },
    {
      resourceType: "Observation",
      id: "obs-103",
      subjectId: "pat-uuid-001",
      categoryCode: "emotional_state",
      codeSystem: "LOINC",
      codeValue: "FLUTUAÇÃO DE HUMOR / ISOLAMENTO",
      valueString: "😐 [HUMOR: ESTÁVEL COM SINTOMAS DE DISTANCIAMENTO DA EQUIPE MÉDICA]",
      effectiveDateTime: "2026-09-05T20:00:00-03:00",
    },
  ]);

  const [categoria, setCategoria] = useState<"symptom" | "emotional_state">("symptom");
  const [sintomaNome, setSintomaNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [humorSelecionado, setHumorSelecionado] = useState("😐");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [statusLog, setStatusLog] = useState("[PRONTUÁRIO ATUALIZADO]");

  // Lista de humores puramente funcionais (dados numéricos / categorizados)
  const humoresFuncionais = [
    { code: "1_BAIXO", emoji: "😔", label: "DISFORIA / TRISTEZA" },
    { code: "2_APREENSIVO", emoji: "😟", label: "APREENSÃO / SCANXIETY" },
    { code: "3_NEUTRO", emoji: "😐", label: "REGULAR / ESTÁVEL" },
    { code: "4_BOM", emoji: "🙂", label: "DISPOSTA / ATIVA" },
    { code: "5_EXCELENTE", emoji: "💪", label: "FORTE / SEM DORES" },
  ];

  const handleSalvarObservacao = (e: React.FormEvent) => {
    e.preventDefault();

    if (categoria === "symptom" && !sintomaNome.trim()) {
      setStatusLog("[FALHA: NOME DO SINTOMA É OBRIGATÓRIO]");
      return;
    }

    const novoId = `obs-${Date.now()}`;
    const novaObs: ObservationResource = {
      resourceType: "Observation",
      id: novoId,
      subjectId: "pat-uuid-001",
      categoryCode: categoria,
      codeSystem: categoria === "symptom" ? "LOINC" : "SNOMED-CT",
      codeValue:
        categoria === "symptom"
          ? sintomaNome.trim().toUpperCase()
          : `REGISTRO_HUMOR_${humorSelecionado}`,
      valueString:
        categoria === "symptom"
          ? descricao.trim()
          : `${humorSelecionado} ${descricao.trim() ? "• " + descricao.trim() : ""}`,
      effectiveDateTime: new Date().toISOString(),
    };

    setObservations([novaObs, ...observations]);
    setSintomaNome("");
    setDescricao("");
    setStatusLog("[REGISTRO ARQUIVADO: OBSERVAÇÃO CLÍNICA INSERIDA COM SUCESSO]");
  };

  const handleExecutarExclusao = (id: string) => {
    if (confirmInput.trim() !== "EXCLUIR") {
      setStatusLog("[ERRO DE CONFIRMAÇÃO: DIGITAÇÃO INEXATA]");
      return;
    }

    setObservations(observations.filter((obs) => obs.id !== id));
    setDeleteId(null);
    setConfirmInput("");
    setStatusLog("[REGISTRO EXCLUÍDO PERMANENTEMENTE DO PRONTUÁRIO]");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="border-b-4 border-clinical-ink pb-4">
        <span className="font-mono text-[10px] sm:text-xs uppercase font-bold text-clinical-action block">
          RECURSO OFICIAL: HL7 FHIR R4 // OBSERVATION
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black uppercase break-words text-clinical-ink">
          MEU DIÁRIO // OBSERVATÓRIO DE SINTOMAS E HUMOR
        </h1>
        <p className="font-mono text-xs sm:text-sm uppercase text-clinical-ink font-bold mt-1 break-words">
          REGISTRO RIGOROSO DE SEQUELAS CRÔNICAS, LINFEDEMA, FADIGA E FLUTUAÇÕES HORMONAIS
        </p>
      </section>

      {/* Log de Estado da Engine */}
      <div className="border-2 border-clinical-ink bg-clinical-ink text-white p-2.5 sm:p-3 font-mono text-xs sm:text-sm uppercase flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
        <span>ESTADO DA ENGINE:</span>
        <span className="text-clinical-surface font-bold break-words">{statusLog}</span>
      </div>

      {/* Formulário de Registro (Sem Modais, Ação Primária em Vinho Terroso) */}
      <section className="border-4 border-clinical-ink bg-clinical-paper p-4 sm:p-5 space-y-4">
        <div className="border-b-2 border-clinical-ink pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h2 className="font-serif text-xl sm:text-2xl font-black uppercase text-clinical-action">
            NOVA OBSERVAÇÃO CLÍNICA
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCategoria("symptom")}
              className={`w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 font-mono text-xs sm:text-sm font-bold uppercase border-2 border-clinical-ink transition-none text-center ${
                categoria === "symptom"
                  ? "bg-clinical-action text-white"
                  : "bg-white text-clinical-ink hover:bg-clinical-surface hover:text-clinical-ink"
              }`}
            >
              REGISTRAR SINTOMA FÍSICO
            </button>
            <button
              type="button"
              onClick={() => setCategoria("emotional_state")}
              className={`w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 font-mono text-xs sm:text-sm font-bold uppercase border-2 border-clinical-ink transition-none text-center ${
                categoria === "emotional_state"
                  ? "bg-clinical-action text-white"
                  : "bg-white text-clinical-ink hover:bg-clinical-surface hover:text-clinical-ink"
              }`}
            >
              REGISTRAR ESTADO EMOCIONAL
            </button>
          </div>
        </div>

        <form onSubmit={handleSalvarObservacao} className="space-y-4">
          {categoria === "symptom" ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="sintoma-nome" className="block font-mono text-xs sm:text-sm font-bold uppercase mb-1 text-clinical-ink">
                  SINTOMA OBSERVADO (EX: FADIGA, INCHAÇO NO BRAÇO, DORES ARTICULARES, ONDAS DE CALOR):
                </label>
                <input
                  id="sintoma-nome"
                  type="text"
                  value={sintomaNome}
                  onChange={(e) => setSintomaNome(e.target.value)}
                  placeholder="DIGITE O SINTOMA..."
                  className="w-full min-h-[48px] px-3 border-2 border-clinical-ink font-mono text-sm sm:text-base bg-white text-clinical-ink focus:outline-none focus:bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="sintoma-desc" className="block font-mono text-xs sm:text-sm font-bold uppercase mb-1 text-clinical-ink">
                  DETALHAMENTO SOMÁTICO (HORÁRIO DE PICO, INTENSIDADE, LOCALIZAÇÃO):
                </label>
                <textarea
                  id="sintoma-desc"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="EX: BRAÇO ESQUERDO COM SENSAÇÃO DE PESO APÓS ESFORÇO REPETITIVO..."
                  className="w-full min-h-[96px] p-3 border-2 border-clinical-ink font-mono text-sm sm:text-base bg-white text-clinical-ink focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block font-mono text-xs sm:text-sm font-bold uppercase text-clinical-ink">
                ESCALA FUNCIONAL DE HUMOR (VALOR ESTATÍSTICO DE DADO):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {humoresFuncionais.map((h) => (
                  <button
                    key={h.code}
                    type="button"
                    onClick={() => setHumorSelecionado(h.emoji)}
                    className={`min-h-[52px] sm:min-h-[56px] p-2 border-2 border-clinical-ink flex flex-col items-center justify-center font-mono text-xs font-bold transition-none ${
                      humorSelecionado === h.emoji
                        ? "bg-clinical-ink text-white border-clinical-ink"
                        : "bg-white text-clinical-ink hover:bg-clinical-surface hover:text-clinical-ink"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl mb-1">{h.emoji}</span>
                    <span className="text-center text-[10px] sm:text-xs">{h.label}</span>
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="humor-desc" className="block font-mono text-xs sm:text-sm font-bold uppercase mb-1 text-clinical-ink">
                  ANOTAÇÃO EMOCIONAL OU CONTEXTO DE ISOLAMENTO:
                </label>
                <textarea
                  id="humor-desc"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="DIGITE SOBRE O ESTADO DE DISPOSIÇÃO OU PENSAMENTOS SOBRE O TRATAMENTO..."
                  className="w-full min-h-[96px] p-3 border-2 border-clinical-ink font-mono text-sm sm:text-base bg-white text-clinical-ink focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 bg-clinical-action text-white font-mono text-sm sm:text-base font-black uppercase border-2 border-clinical-ink hover:bg-clinical-ink hover:text-white transition-none text-center"
          >
            ARQUIVAR OBSERVAÇÃO NO PRONTUÁRIO
          </button>
        </form>
      </section>

      {/* Histórico Cronológico de Observações */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-black uppercase border-b-2 border-clinical-ink pb-2 text-clinical-ink">
          HISTÓRICO CRONOLÓGICO DE REGISTROS
        </h2>

        {observations.length === 0 ? (
          <div className="border-4 border-clinical-ink p-6 sm:p-8 bg-white text-center font-mono text-base sm:text-lg font-black uppercase text-clinical-ink">
            [NENHUM EVENTO CLÍNICO REGISTRADO NESTA COMPETÊNCIA]
          </div>
        ) : (
          observations.map((obs) => {
            const dataObj = new Date(obs.effectiveDateTime);
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
                key={obs.id}
                className="border-2 border-clinical-ink bg-white p-3.5 sm:p-5 space-y-3"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-clinical-ink pb-2 gap-2">
                  <div>
                    <span className="font-mono text-[10px] sm:text-xs font-bold uppercase block text-clinical-ink/70">
                      ID: {obs.id} // SISTEMA: {obs.codeSystem} // CATEGORIA: {obs.categoryCode.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-black uppercase text-clinical-action break-words">
                      {obs.codeValue}
                    </h3>
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-black bg-clinical-ink text-white px-2.5 py-1 border border-clinical-ink self-start md:self-auto shrink-0">
                    {dataFormatada} • {horaFormatada}
                  </div>
                </div>

                {obs.valueString && (
                  <p className="font-mono text-xs sm:text-base bg-clinical-paper text-clinical-ink border border-clinical-ink p-2.5 sm:p-3 font-bold break-words">
                    DADO REGISTRADO: {obs.valueString}
                  </p>
                )}

                {/* MECANISMO DE EXCLUSÃO INLINE SEM MODAL */}
                <div className="pt-2 border-t border-clinical-ink">
                  {deleteId === obs.id ? (
                    <div className="border-2 border-clinical-ink bg-clinical-alert text-white p-3 space-y-2">
                      <div className="font-mono text-xs sm:text-sm font-bold uppercase break-words">
                        ATENÇÃO: AÇÃO DESTRUTIVA DEFINITIVA. PARA CONFIRMAR, DIGITE &ldquo;EXCLUIR&rdquo;:
                      </div>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center">
                        <input
                          type="text"
                          value={confirmInput}
                          onChange={(e) => setConfirmInput(e.target.value)}
                          placeholder="DIGITE EXCLUIR"
                          className="w-full sm:w-auto flex-1 min-h-[44px] sm:min-h-[48px] px-3 border-2 border-clinical-ink font-mono text-sm sm:text-base uppercase bg-white text-clinical-ink focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecutarExclusao(obs.id)}
                          className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 sm:px-6 bg-clinical-ink text-white font-mono text-xs sm:text-sm font-black uppercase border-2 border-white hover:bg-white hover:text-clinical-ink transition-none text-center"
                        >
                          CONFIRMAR EXCLUSÃO
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteId(null);
                            setConfirmInput("");
                          }}
                          className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 bg-clinical-paper text-clinical-ink font-mono text-xs sm:text-sm font-bold uppercase border-2 border-clinical-ink hover:bg-clinical-surface hover:text-clinical-ink transition-none text-center"
                        >
                          CANCELAR
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteId(obs.id);
                          setConfirmInput("");
                        }}
                        className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 bg-transparent text-clinical-ink font-mono text-xs sm:text-sm font-bold uppercase border-2 border-clinical-ink hover:bg-clinical-alert hover:text-white transition-none text-center"
                      >
                        REMOVER REGISTRO
                      </button>
                    </div>
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
