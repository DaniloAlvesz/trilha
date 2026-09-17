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

  // Lista de humores com linguagem acolhedora e humana
  const humoresFuncionais = [
    { code: "1_BAIXO", emoji: "😔", label: "Triste ou desanimada" },
    { code: "2_APREENSIVO", emoji: "😟", label: "Apreensiva / Ansiosa" },
    { code: "3_NEUTRO", emoji: "😐", label: "Estável / Em paz" },
    { code: "4_BOM", emoji: "🙂", label: "Disposta e ativa" },
    { code: "5_EXCELENTE", emoji: "💪", label: "Forte e confiante" },
  ];

  // Sintomas frequentes para seleção com 1 clique (Design Antecipatório)
  const sintomasFrequentes = [
    "Fadiga severa matinal",
    "Inchaço e peso no braço esquerdo",
    "Ondas de calor (fogachos)",
    "Dores nas articulações",
    "Enjoo ou indisposição digestiva",
    "Sensibilidade ou ressecamento na pele",
  ];

  const handleSalvarObservacao = (e: React.FormEvent) => {
    e.preventDefault();

    if (categoria === "symptom" && !sintomaNome.trim()) {
      setStatusLog("Por favor, selecione ou digite o sintoma observado");
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
          ? sintomaNome.trim()
          : `Humor: ${humorSelecionado}`,
      valueString:
        categoria === "symptom"
          ? descricao.trim()
          : `${humorSelecionado} ${descricao.trim() ? "• " + descricao.trim() : ""}`,
      effectiveDateTime: new Date().toISOString(),
    };

    setObservations([novaObs, ...observations]);
    setSintomaNome("");
    setDescricao("");
    setStatusLog("Sua anotação foi guardada com sucesso!");
  };

  const handleExecutarExclusao = (id: string) => {
    if (confirmInput.trim().toUpperCase() !== "EXCLUIR") {
      setStatusLog("Para confirmar a exclusão, digite a palavra EXCLUIR");
      return;
    }

    setObservations(observations.filter((obs) => obs.id !== id));
    setDeleteId(null);
    setConfirmInput("");
    setStatusLog("Anotação removida do seu histórico");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho Acolhedor */}
      <section className="bg-clinical-paper border border-clinical-ink/20 rounded-2xl p-5 sm:p-6 shadow-sm">
        <span className="font-sans text-xs sm:text-sm font-semibold text-clinical-action block">
          Acompanhamento do seu corpo e do seu bem-estar
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clinical-ink mt-0.5">
          Meu Diário de Cuidados
        </h1>
        <p className="font-sans text-sm sm:text-base text-clinical-ink/80 mt-1 leading-relaxed">
          Um espaço calmo para anotar como você está se sentindo a cada dia. Esses registros ajudam você e seu oncologista a ajustarem o tratamento com muito mais precisão e tranquilidade.
        </p>
      </section>

      {/* Formulário Humanizado de Registro */}
      <section className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        <div className="border-b border-clinical-ink/15 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
              Nova anotação de hoje
            </h2>
            <span className="font-sans text-xs sm:text-sm text-clinical-ink/70">
              Escolha o que você gostaria de registrar agora:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setCategoria("symptom")}
              className={`flex-1 md:flex-none min-h-[44px] px-4 rounded-xl font-sans text-xs sm:text-sm font-bold transition-all shadow-sm ${
                categoria === "symptom"
                  ? "bg-clinical-action text-white"
                  : "bg-clinical-paper text-clinical-ink hover:bg-clinical-surface hover:text-clinical-ink"
              }`}
            >
              Sentindo algo no corpo
            </button>
            <button
              type="button"
              onClick={() => setCategoria("emotional_state")}
              className={`flex-1 md:flex-none min-h-[44px] px-4 rounded-xl font-sans text-xs sm:text-sm font-bold transition-all shadow-sm ${
                categoria === "emotional_state"
                  ? "bg-clinical-action text-white"
                  : "bg-clinical-paper text-clinical-ink hover:bg-clinical-surface hover:text-clinical-ink"
              }`}
            >
              Como está meu emocional
            </button>
          </div>
        </div>

        <form onSubmit={handleSalvarObservacao} className="space-y-4">
          {categoria === "symptom" ? (
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1.5">
                  Como você está se sentindo fisicamente? (Selecione um atalho rápido ou digite):
                </label>

                {/* Atalhos Rápidos de Sintomas Frequentes (Design Antecipatório) */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {sintomasFrequentes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSintomaNome(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-sans font-medium border transition-all ${
                        sintomaNome === item
                          ? "bg-clinical-action text-white border-clinical-action shadow-sm"
                          : "bg-clinical-paper text-clinical-ink border-clinical-ink/20 hover:border-clinical-action"
                      }`}
                    >
                      + {item}
                    </button>
                  ))}
                </div>

                <input
                  id="sintoma-nome"
                  type="text"
                  value={sintomaNome}
                  onChange={(e) => setSintomaNome(e.target.value)}
                  placeholder="Ou digite o nome do sintoma aqui..."
                  className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                  required
                />
              </div>

              <div>
                <label htmlFor="sintoma-desc" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                  Quer contar mais detalhes? (onde sente, em qual horário do dia é mais forte - opcional):
                </label>
                <textarea
                  id="sintoma-desc"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Senti o braço mais pesado após carregar sacolas pela manhã..."
                  className="w-full min-h-[90px] p-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                Como está o seu emocional hoje? (Escolha a opção que mais se aproxima do seu momento):
              </label>
              
              {/* Seletores Visuais de Humor */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {humoresFuncionais.map((h) => (
                  <button
                    key={h.code}
                    type="button"
                    onClick={() => setHumorSelecionado(h.emoji)}
                    className={`min-h-[64px] p-2.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      humorSelecionado === h.emoji
                        ? "bg-clinical-action text-white border-clinical-action shadow-sm"
                        : "bg-clinical-paper text-clinical-ink border-clinical-ink/20 hover:border-clinical-surface"
                    }`}
                  >
                    <span className="text-2xl mb-1">{h.emoji}</span>
                    <span className="text-center text-[11px] sm:text-xs font-semibold leading-tight">{h.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="humor-desc" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                  Quer deixar um pensamento, desabafo ou momento especial anotado? (opcional):
                </label>
                <textarea
                  id="humor-desc"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Escreva livremente sobre o seu dia, sentimentos ou conquistas..."
                  className="w-full min-h-[90px] p-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-7 rounded-xl bg-clinical-action text-white font-sans text-sm sm:text-base font-bold hover:bg-clinical-ink transition-all shadow-sm text-center"
          >
            Salvar anotação no meu diário
          </button>
        </form>
      </section>

      {/* Histórico Acolhedor de Registros */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
          Suas anotações anteriores
        </h2>

        {observations.length === 0 ? (
          <div className="rounded-2xl border border-clinical-ink/20 p-6 sm:p-8 bg-white text-center font-sans text-base font-medium text-clinical-ink/70 shadow-sm">
            Você ainda não tem anotações salvas. Que tal registrar como você está agora?
          </div>
        ) : (
          observations.map((obs) => {
            const dataObj = new Date(obs.effectiveDateTime);
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
                key={obs.id}
                className="rounded-2xl border border-clinical-ink/20 bg-white p-4 sm:p-5 space-y-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-clinical-ink/15 pb-2.5 gap-2">
                  <div>
                    <span className="font-sans text-xs font-semibold text-clinical-action block">
                      {obs.categoryCode === "symptom" ? "Sintoma Físico" : "Estado Emocional"}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-clinical-ink break-words capitalize">
                      {obs.codeValue.toLowerCase()}
                    </h3>
                  </div>
                  <div className="font-sans text-xs font-medium text-clinical-ink/70 bg-clinical-paper px-3 py-1 rounded-full border border-clinical-ink/15 self-start sm:self-auto shrink-0">
                    {dataFormatada} às {horaFormatada}
                  </div>
                </div>

                {obs.valueString && (
                  <p className="font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink rounded-xl p-3 border border-clinical-ink/10 leading-relaxed">
                    {obs.valueString}
                  </p>
                )}

                {/* Exclusão Inline Empática */}
                <div className="pt-2 border-t border-clinical-ink/15">
                  {deleteId === obs.id ? (
                    <div className="rounded-xl border border-clinical-alert/30 bg-clinical-alert text-white p-4 space-y-3 shadow-sm">
                      <div className="font-sans text-xs sm:text-sm font-semibold leading-relaxed">
                        Tem certeza que deseja apagar esta anotação? Digite <strong>EXCLUIR</strong> abaixo para confirmar:
                      </div>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center">
                        <input
                          type="text"
                          value={confirmInput}
                          onChange={(e) => setConfirmInput(e.target.value)}
                          placeholder="Digite EXCLUIR"
                          className="w-full sm:w-auto flex-1 min-h-[44px] px-3 rounded-lg font-sans text-sm uppercase bg-white text-clinical-ink focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecutarExclusao(obs.id)}
                          className="w-full sm:w-auto min-h-[44px] px-5 rounded-lg bg-clinical-ink text-white font-sans text-xs sm:text-sm font-bold hover:bg-white hover:text-clinical-ink transition-all shadow-sm text-center"
                        >
                          Confirmar exclusão
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteId(null);
                            setConfirmInput("");
                          }}
                          className="w-full sm:w-auto min-h-[44px] px-4 rounded-lg bg-white/20 text-white font-sans text-xs sm:text-sm font-semibold hover:bg-white/30 transition-all text-center"
                        >
                          Cancelar
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
                        className="text-clinical-ink/70 hover:text-clinical-alert font-sans text-xs sm:text-sm font-semibold transition-all"
                      >
                        Excluir esta anotação
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
