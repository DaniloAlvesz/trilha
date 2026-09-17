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
  const [sintomaNome, setSintomaNome] = useState("🥱 Fadiga matinal");
  const [intensidade, setIntensidade] = useState(3);
  const [descricao, setDescricao] = useState("");
  const [humorSelecionado, setHumorSelecionado] = useState("🙂");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [statusLog, setStatusLog] = useState("Registro pronto para uso");

  // Lista de humores com linguagem acolhedora e humana (touch targets >= 48dp)
  const humoresFuncionais = [
    { code: "1_BAIXO", emoji: "😔", label: "Desanimada" },
    { code: "2_APREENSIVO", emoji: "😟", label: "Apreensiva" },
    { code: "3_NEUTRO", emoji: "😐", label: "Em paz" },
    { code: "4_BOM", emoji: "🙂", label: "Disposta" },
    { code: "5_EXCELENTE", emoji: "💪", label: "Confiante" },
  ];

  // Chips frequentes com emojis (Design Antecipatório - Thumb Zone)
  const chipsSintomas = [
    { emoji: "✨", label: "Estou ótima!", isWellbeing: true },
    { emoji: "🥱", label: "Fadiga matinal" },
    { emoji: "🎈", label: "Inchaço no braço" },
    { emoji: "🔥", label: "Ondas de calor" },
    { emoji: "🦴", label: "Dores articulares" },
    { emoji: "💭", label: "Sono agitado" },
    { emoji: "🤢", label: "Enjoo ou náusea" },
    { emoji: "🌸", label: "Pele sensível" },
  ];

  const niveisDeIntensidade = [
    { nivel: 1, label: "Leve (quase imperceptível)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { nivel: 2, label: "Moderada (incomoda um pouco)", color: "text-teal-700 bg-teal-50 border-teal-200" },
    { nivel: 3, label: "Média (presente na rotina)", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { nivel: 4, label: "Forte (atrapalha tarefas)", color: "text-orange-700 bg-orange-50 border-orange-200" },
    { nivel: 5, label: "Intensa (precisa de repouso)", color: "text-rose-700 bg-rose-50 border-rose-200" },
  ];

  const handleSalvarObservacao = (e: React.FormEvent) => {
    e.preventDefault();

    if (categoria === "symptom" && !sintomaNome.trim()) {
      setStatusLog("Por favor, selecione um dos atalhos rápidos de sintomas");
      return;
    }

    const isWellbeing = sintomaNome.includes("Estou ótima!");
    const nivelObj = niveisDeIntensidade.find((n) => n.nivel === intensidade);
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
          ? isWellbeing
            ? "Sensação de bem-estar geral e energia positiva!"
            : `Intensidade: ${nivelObj?.label || `${intensidade}/5`}${descricao.trim() ? " • " + descricao.trim() : ""}`
          : `${humorSelecionado} ${descricao.trim() ? "• " + descricao.trim() : ""}`,
      effectiveDateTime: new Date().toISOString(),
    };

    setObservations([novaObs, ...observations]);
    setDescricao("");
    setStatusLog("Sua anotação foi guardada com carinho!");
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
      <section className="bg-clinical-paper border border-clinical-surface/40 rounded-3xl p-5 sm:p-6 shadow-sm">
        <span className="font-sans text-xs sm:text-sm font-semibold text-clinical-action block">
          Acompanhamento diário sem esforço
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clinical-ink mt-0.5">
          Meu Diário de Cuidados
        </h1>
        <p className="font-sans text-sm sm:text-base text-clinical-ink/85 mt-1 leading-relaxed">
          Toque nas opções rápidas para registrar como seu corpo e suas emoções estão hoje. Sem formulários longos ou digitação cansativa.
        </p>
      </section>

      {/* Formulário com Design Antecipatório & Thumb Zone */}
      <section className="rounded-3xl border border-clinical-surface/30 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        <div className="border-b border-clinical-surface/20 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
              Como você está agora?
            </h2>
            <span className="font-sans text-xs sm:text-sm text-clinical-ink/70">
              Escolha uma categoria para registro rápido:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCategoria("symptom")}
              className={`min-h-[48px] px-4 rounded-2xl font-sans text-xs sm:text-sm font-bold transition-all select-none active:scale-95 shadow-xs ${
                categoria === "symptom"
                  ? "bg-clinical-action text-white shadow-sm"
                  : "bg-clinical-paper text-clinical-ink hover:bg-clinical-surface/30"
              }`}
            >
              🌸 Sinais no corpo
            </button>
            <button
              type="button"
              onClick={() => setCategoria("emotional_state")}
              className={`min-h-[48px] px-4 rounded-2xl font-sans text-xs sm:text-sm font-bold transition-all select-none active:scale-95 shadow-xs ${
                categoria === "emotional_state"
                  ? "bg-clinical-action text-white shadow-sm"
                  : "bg-clinical-paper text-clinical-ink hover:bg-clinical-surface/30"
              }`}
            >
              💭 Meu emocional
            </button>
          </div>
        </div>

        <form onSubmit={handleSalvarObservacao} className="space-y-5">
          {categoria === "symptom" ? (
            <div className="space-y-5">
              <div>
                <label className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-2">
                  Selecione o sintoma ou estado atual (toque para escolher):
                </label>

                {/* Seleção Rápida: Chips Grandes com Emojis (Touch Targets >= 48dp) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {chipsSintomas.map((item) => {
                    const fullLabel = `${item.emoji} ${item.label}`;
                    const isSelected = sintomaNome === fullLabel;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSintomaNome(fullLabel)}
                        className={`min-h-[50px] p-2.5 rounded-2xl text-xs sm:text-sm font-sans font-semibold border-2 transition-all flex items-center justify-center gap-2 select-none active:scale-95 ${
                          isSelected
                            ? "bg-clinical-action text-white border-clinical-action shadow-sm font-bold scale-[1.02]"
                            : item.isWellbeing
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-500"
                            : "bg-clinical-paper text-clinical-ink border-clinical-surface/30 hover:border-clinical-action"
                        }`}
                      >
                        <span className="text-xl shrink-0">{item.emoji}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Intensidade em Slider (Substitui digitação por controle deslizante) */}
              {!sintomaNome.includes("Estou ótima!") && (
                <div className="rounded-2xl border border-clinical-surface/30 p-4 sm:p-5 bg-clinical-paper space-y-3">
                  <div className="flex justify-between items-center">
                    <label htmlFor="intensidade-slider" className="font-sans text-xs sm:text-sm font-bold text-clinical-ink">
                      Qual a intensidade que você sente?
                    </label>
                    <span className="font-sans text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-clinical-surface/40 text-clinical-action">
                      Nível {intensidade} de 5
                    </span>
                  </div>

                  {/* Slider com touch target ergonômico */}
                  <div className="py-2">
                    <input
                      id="intensidade-slider"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={intensidade}
                      onChange={(e) => setIntensidade(Number(e.target.value))}
                      className="w-full h-3 bg-white rounded-lg appearance-none cursor-pointer accent-clinical-action shadow-inner"
                    />
                    <div className="flex justify-between text-[11px] font-sans font-semibold text-clinical-ink/70 mt-1.5 px-1">
                      <span>1 • Leve</span>
                      <span>2 • Moderada</span>
                      <span>3 • Média</span>
                      <span>4 • Forte</span>
                      <span>5 • Intensa</span>
                    </div>
                  </div>

                  {/* Feedback visual amigável do nível selecionado */}
                  <div className={`p-2.5 rounded-xl border text-xs font-sans font-semibold text-center ${niveisDeIntensidade[intensidade - 1].color}`}>
                    {niveisDeIntensidade[intensidade - 1].label}
                  </div>
                </div>
              )}

              {/* Detalhe Opcional (Nunca obrigatório) */}
              <div>
                <label htmlFor="sintoma-desc" className="block font-sans text-xs text-clinical-ink/70 mb-1">
                  Quer adicionar alguma anotação extra? (opcional):
                </label>
                <input
                  id="sintoma-desc"
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Começou logo após o almoço..."
                  className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/20 font-sans text-sm bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                Como está o seu coração e o seu ânimo hoje? (Toque no emoji que melhor traduz o momento):
              </label>

              {/* Seletores Visuais de Humor com touch targets confortáveis */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {humoresFuncionais.map((h) => (
                  <button
                    key={h.code}
                    type="button"
                    onClick={() => setHumorSelecionado(h.emoji)}
                    className={`min-h-[64px] p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all select-none active:scale-95 ${
                      humorSelecionado === h.emoji
                        ? "bg-clinical-action text-white border-clinical-action shadow-sm scale-[1.02]"
                        : "bg-clinical-paper text-clinical-ink border-clinical-surface/30 hover:border-clinical-surface"
                    }`}
                  >
                    <span className="text-2xl mb-1">{h.emoji}</span>
                    <span className="text-center text-[11px] sm:text-xs font-semibold leading-tight">
                      {h.label}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="humor-desc" className="block font-sans text-xs text-clinical-ink/70 mb-1">
                  Quer deixar um pensamento, desabafo ou conquista anotada? (opcional):
                </label>
                <textarea
                  id="humor-desc"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Escreva livremente o que estiver sentindo..."
                  className="w-full min-h-[84px] p-3.5 rounded-xl border border-clinical-ink/20 font-sans text-sm bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                />
              </div>
            </div>
          )}

          {/* Botão de Gravação na Thumb Zone (Min 52px) */}
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[52px] px-8 rounded-2xl bg-clinical-action text-white font-sans text-sm sm:text-base font-bold hover:bg-clinical-action/90 transition-all shadow-sm text-center active:scale-95"
          >
            Guardar anotação no diário
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
                        className="min-h-[48px] px-3 py-2 inline-flex items-center text-clinical-ink/70 hover:text-clinical-alert font-sans text-xs sm:text-sm font-semibold transition-all select-none"
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
