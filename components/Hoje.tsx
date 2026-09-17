"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MotorStatusPayload } from "@/types/clinical";

export default function PainelHoje() {
  // Estado local simulando carga otimista dos dados clínicos do paciente
  const [motorState, setMotorState] = useState<MotorStatusPayload>({
    motor1ReportReady: true,
    motor1NextEncounterDays: 6,
    motor1NextEncounterDate: "2026-09-17",
    motor2SuggestedQuestions: [
      "Fadiga severa matinal reportada 4 vezes nos últimos 90 dias",
      "Inchaço e peso no braço esquerdo reportado 3 vezes nos últimos 90 dias",
    ],
    motor3SupplyDaysLeft: 4, // <= 5 ativa alerta crítico
    motor3CriticalAlert: true,
    motor3TotalSupply: 30,
    motor3DosesTaken: 26,
    motor4ScanxietyActive: true,
    motor4ExamType: "MAMOGRAFIA DIGITAL DE CONTROLE",
    motor4ExamDaysLeft: 3,
  });

  const [doseIngeridaHoje, setDoseIngeridaHoje] = useState(false);
  const [statusLog, setStatusLog] = useState<string>("[STATUS: PRONTUÁRIO ATUALIZADO]");
  const [perguntasPauta, setPerguntasPauta] = useState<string[]>([]);
  const [scanxietyRegistrado, setScanxietyRegistrado] = useState(false);
  const [scanxietyNota, setScanxietyNota] = useState("");

  // Motor 3: Handler de Ingestão de Dose Diária (Optimistic UI)
  const handleToggleDose = () => {
    const novoStatus = !doseIngeridaHoje;
    setDoseIngeridaHoje(novoStatus);

    if (novoStatus) {
      const novasDoses = motorState.motor3DosesTaken + 1;
      const novoEstoque = motorState.motor3TotalSupply - novasDoses;
      setMotorState((prev) => ({
        ...prev,
        motor3DosesTaken: novasDoses,
        motor3SupplyDaysLeft: novoEstoque,
        motor3CriticalAlert: novoEstoque <= 5,
      }));
      setStatusLog("[REGISTRO ARQUIVADO: DOSE DIÁRIA 20MG CONFIRMADA]");
    } else {
      const novasDoses = Math.max(0, motorState.motor3DosesTaken - 1);
      const novoEstoque = motorState.motor3TotalSupply - novasDoses;
      setMotorState((prev) => ({
        ...prev,
        motor3DosesTaken: novasDoses,
        motor3SupplyDaysLeft: novoEstoque,
        motor3CriticalAlert: novoEstoque <= 5,
      }));
      setStatusLog("[REVOGAÇÃO REGISTRADA: STATUS REVERTIDO]");
    }
  };

  // Motor 2: Adição à pauta médica
  const handleAdicionarPauta = (pergunta: string) => {
    setPerguntasPauta((prev) => [...prev, pergunta]);
    setMotorState((prev) => ({
      ...prev,
      motor2SuggestedQuestions: prev.motor2SuggestedQuestions.filter((q) => q !== pergunta),
    }));
    setStatusLog("[PAUTA ATUALIZADA: TÓPICO INCLUÍDO NO RELATÓRIO CLÍNICO]");
  };

  const handleRecusarPauta = (pergunta: string) => {
    setMotorState((prev) => ({
      ...prev,
      motor2SuggestedQuestions: prev.motor2SuggestedQuestions.filter((q) => q !== pergunta),
    }));
    setStatusLog("[SUGESTÃO DESCARTADA PELO OPERADOR]");
  };

  return (
    <div className="space-y-6">
      {/* Saudação e Estado Geral */}
      <section className="bg-clinical-paper border border-clinical-ink/20 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <span className="font-sans text-xs sm:text-sm text-clinical-ink/70 block capitalize">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink mt-0.5">
            Olá! Como você está se sentindo hoje?
          </h2>
        </div>
        <div className="rounded-full bg-clinical-surface/20 text-clinical-ink font-sans text-xs sm:text-sm font-semibold px-3.5 py-1.5 border border-clinical-ink/20 shrink-0">
          {statusLog.replace(/^\[|\]$/g, "")}
        </div>
      </section>

      {/* JORNADA VISUAL DE SUPERAÇÃO (GAMIFICAÇÃO & CUSTO AFUNDADO) */}
      <section className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-clinical-action">
              Sua jornada de força e superação
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink mt-0.5">
              14 de 60 meses completados com sucesso
            </h3>
          </div>
          <div className="rounded-xl bg-clinical-success text-white px-3.5 py-1.5 font-sans font-bold text-sm shadow-sm self-start sm:self-auto">
            96,7% de constância
          </div>
        </div>

        {/* Barra gráfica de progresso */}
        <div className="space-y-1.5">
          <div className="w-full bg-clinical-paper h-4 rounded-full overflow-hidden p-0.5 border border-clinical-ink/20 shadow-inner">
            <div
              className="bg-clinical-action h-full rounded-full transition-all duration-500"
              style={{ width: `${(14 / 60) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-clinical-ink/70 font-sans">
            <span>Início do tratamento</span>
            <span className="font-semibold text-clinical-action">Você já venceu mais de 1 ano completo!</span>
            <span>Meta: 5 anos</span>
          </div>
        </div>

        <p className="text-sm sm:text-base font-sans text-clinical-ink/90 leading-relaxed">
          Cada dose tomada e cada dia superado fortalecem a sua saúde e a sua proteção. Ter chegado até aqui demonstra imensa dedicação e cuidado com você mesma. Continue firme nesse caminho!
        </p>
      </section>

      {/* LEMBRETE POSITIVO DE RENOVAÇÃO DE RECEITA (REENQUADRAMENTO DE ALERTA) */}
      {motorState.motor3CriticalAlert && (
        <section
          role="alert"
          aria-live="assertive"
          className="rounded-2xl bg-clinical-alert text-white p-5 sm:p-6 shadow-md space-y-3"
        >
          <div className="inline-block rounded-full bg-white/20 text-white px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider">
            Lembrete de cuidado
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Faltam 4 dias para concluir esta caixa. Vamos renovar a receita?
          </h2>
          <p className="text-sm sm:text-base font-sans text-white/95 leading-relaxed">
            Você tem mantido sua rotina com excelente regularidade! Como restam {motorState.motor3SupplyDaysLeft} comprimidos de Tamoxifeno 20mg na sua caixa atual, é uma boa hora para solicitar a nova receita ao seu oncologista ou preparar a retirada no posto.
          </p>
          <div className="pt-1 flex flex-wrap gap-2">
            <Link
              href="/agenda"
              className="rounded-xl bg-white text-clinical-ink px-4 py-2.5 font-sans text-xs sm:text-sm font-bold shadow-sm hover:bg-clinical-paper transition-all"
            >
              Consultar minhas próximas datas
            </Link>
          </div>
        </section>
      )}

      {/* CHECK-IN PREVENTIVO DE ANSIEDADE PRÉ-EXAME (SCANXIETY) */}
      {motorState.motor4ScanxietyActive && (
        <section className="rounded-2xl border border-clinical-action/30 bg-clinical-paper p-5 sm:p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-clinical-action text-white px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider">
              Acolhimento pré-exame
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-action break-words">
              Seu próximo exame está se aproximando: {motorState.motor4ExamType?.toLowerCase() || "exame"} em {motorState.motor4ExamDaysLeft} dias
            </h2>
            <p className="text-sm sm:text-base font-sans text-clinical-ink/90 leading-relaxed">
              Sentir frio na barriga, ansiedade ou apreensão antes de exames de rotina é uma reação muito natural e compreensível. Reconhecer essas emoções ajuda a tirar o peso dos pensamentos.
            </p>

            {!scanxietyRegistrado ? (
              <div className="rounded-xl border border-clinical-ink/20 p-4 sm:p-5 bg-white space-y-3.5 mt-3 shadow-sm">
                <label className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink">
                  Como você está se sentindo em relação a esse exame? (Toque para selecionar):
                </label>

                {/* Seletores rápidos de humor / sentimento */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Tranquila e confiante",
                    "Um pouco apreensiva",
                    "Com pensamentos acelerados",
                    "Sentindo tensão no corpo",
                    "Focada no presente",
                  ].map((sensacao) => (
                    <button
                      key={sensacao}
                      type="button"
                      onClick={() => setScanxietyNota((prev) => prev ? `${prev} • ${sensacao}` : sensacao)}
                      className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-sans font-medium bg-clinical-surface/20 text-clinical-ink border border-clinical-ink/20 hover:bg-clinical-action hover:text-white transition-all"
                    >
                      + {sensacao}
                    </button>
                  ))}
                </div>

                <div>
                  <label htmlFor="scanxiety-input" className="block font-sans text-xs text-clinical-ink/70 mt-2 mb-1">
                    Quer deixar um pensamento ou desabafo por escrito? (opcional):
                  </label>
                  <textarea
                    id="scanxiety-input"
                    value={scanxietyNota}
                    onChange={(e) => setScanxietyNota(e.target.value)}
                    placeholder="Escreva livremente o que estiver em seu coração..."
                    className="w-full p-3 rounded-lg border border-clinical-ink/30 font-sans text-sm sm:text-base min-h-[80px] bg-clinical-paper text-clinical-ink focus:outline-none focus:ring-2 focus:ring-clinical-action/30"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setScanxietyRegistrado(true);
                    setStatusLog("Check-in de acolhimento salvo com carinho");
                  }}
                  className="rounded-xl px-5 py-2.5 bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-ink transition-all shadow-sm"
                >
                  Guardar este momento de autocuidado
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-clinical-success/30 p-4 bg-clinical-success text-white font-sans text-xs sm:text-sm font-semibold shadow-sm">
                ✓ Seu check-in de autocuidado foi salvo. Respire fundo: você é forte e está cuidando muito bem de si mesma.
              </div>
            )}
          </div>
        </section>
      )}

      {/* LEMBRETE DE RELATÓRIO PRONTO PARA A CONSULTA */}
      {motorState.motor1ReportReady && (
        <section className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <div className="inline-block rounded-full bg-clinical-surface text-clinical-ink px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider">
                Próxima consulta em {motorState.motor1NextEncounterDays} dias
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink break-words">
                Seu resumo para a consulta está pronto
              </h2>
              <p className="text-sm sm:text-base font-sans text-clinical-ink/80">
                Organizamos seus registros diários, sintomas e regularidade do tratamento para você levar impresso ou abrir no celular durante a conversa com o médico.
              </p>
            </div>
            <Link
              href="/relatorio-print"
              className="w-full md:w-auto flex-shrink-0 px-5 py-3 rounded-xl bg-clinical-action text-white font-sans text-xs sm:text-sm md:text-base font-bold inline-flex items-center justify-center hover:bg-clinical-ink transition-all shadow-sm text-center"
            >
              Ver relatório para consulta
            </Link>
          </div>
        </section>
      )}

      {/* GESTÃO DIÁRIA DO MEDICAMENTO */}
      <section className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="border-b border-clinical-ink/15 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="font-sans text-xs text-clinical-ink/70 font-semibold block">Tratamento Contínuo</span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
              Dose diária de Tamoxifeno
            </h2>
          </div>
          <div className="rounded-lg font-sans text-xs sm:text-sm bg-clinical-paper text-clinical-ink px-3 py-1.5 border border-clinical-ink/20 font-semibold shrink-0">
            20mg • 1 comprimido por dia
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-sm sm:text-base text-clinical-ink">
          <div className="rounded-xl border border-clinical-ink/15 p-3.5 bg-clinical-paper">
            <span className="text-xs block font-bold text-clinical-ink/70">Posologia:</span>
            <span className="text-base sm:text-lg font-bold">1 comprimido ao dia</span>
          </div>
          <div className="rounded-xl border border-clinical-ink/15 p-3.5 bg-clinical-paper">
            <span className="text-xs block font-bold text-clinical-ink/70">Total da caixa:</span>
            <span className="text-base sm:text-lg font-bold">{motorState.motor3TotalSupply} comprimidos</span>
          </div>
          <div className="rounded-xl border border-clinical-ink/15 p-3.5 bg-clinical-paper">
            <span className="text-xs block font-bold text-clinical-ink/70">Comprimidos restantes:</span>
            <span className={`text-base sm:text-lg font-bold ${motorState.motor3CriticalAlert ? "text-clinical-alert" : "text-clinical-ink"}`}>
              {motorState.motor3SupplyDaysLeft} dias restantes
            </span>
          </div>
        </div>

        {/* BOTÃO PRINCIPAL DE CONFIRMAÇÃO DA DOSE */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleToggleDose}
            className={`w-full min-h-[58px] p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 cursor-pointer shadow-sm ${
              doseIngeridaHoje
                ? "bg-clinical-success text-white border-clinical-success"
                : "bg-clinical-paper text-clinical-ink border-clinical-ink/30 hover:border-clinical-action hover:bg-white"
            }`}
            aria-pressed={doseIngeridaHoje}
          >
            <div
              className={`w-10 h-10 shrink-0 rounded-lg border-2 flex items-center justify-center font-sans text-xl font-bold transition-all ${
                doseIngeridaHoje
                  ? "bg-white text-clinical-success border-white"
                  : "bg-white text-transparent border-clinical-ink/30"
              }`}
            >
              ✓
            </div>
            <div className="min-w-0">
              <span className="font-sans text-xs block font-semibold tracking-wide">
                {doseIngeridaHoje ? "Dose do dia confirmada!" : "Aguardando confirmação de hoje"}
              </span>
              <span className="font-serif text-base sm:text-lg font-bold break-words block">
                {doseIngeridaHoje
                  ? "Parabéns! Você já tomou o comprimido de hoje."
                  : "Toque aqui para registrar a tomada de hoje (20mg)"}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* SUGESTÕES PROATIVAS DE PAUTA PARA O ONCOLOGISTA */}
      <section className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="border-b border-clinical-ink/15 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-clinical-action">
            Preparação para a consulta
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5 break-words text-clinical-ink">
            Lembretes importantes para conversar com o médico
          </h2>
          <p className="font-sans text-xs sm:text-sm text-clinical-ink/70 mt-1">
            Identificamos alguns sintomas que você relatou recentemente. Deseja incluir essas perguntas no seu resumo para não esquecer de comentar na consulta?
          </p>
        </div>

        {motorState.motor2SuggestedQuestions.length === 0 && perguntasPauta.length === 0 ? (
          <div className="rounded-xl border border-clinical-ink/15 p-4 bg-clinical-paper font-sans text-sm sm:text-base text-clinical-ink/80 text-center">
            Nenhum sintoma recorrente identificado no momento. Tudo parece bem e calmo!
          </div>
        ) : (
          <div className="space-y-3.5">
            {motorState.motor2SuggestedQuestions.map((pergunta, idx) => (
              <div key={idx} className="rounded-xl border border-clinical-ink/20 p-4 bg-clinical-paper space-y-2.5">
                <div className="font-serif text-base sm:text-lg font-bold break-words text-clinical-ink">
                  &ldquo;{pergunta}&rdquo;
                </div>
                <p className="font-sans text-xs sm:text-sm text-clinical-ink/80">
                  Deseja adicionar este ponto à sua lista de dúvidas para o oncologista?
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAdicionarPauta(pergunta)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-ink transition-all shadow-sm text-center"
                  >
                    Sim, adicionar à lista
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRecusarPauta(pergunta)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-clinical-surface text-clinical-ink font-sans text-xs sm:text-sm font-semibold hover:bg-clinical-ink hover:text-white transition-all text-center"
                  >
                    Não precisa lembrar
                  </button>
                </div>
              </div>
            ))}

            {perguntasPauta.length > 0 && (
              <div className="rounded-xl border border-clinical-action/20 p-4 bg-clinical-action text-white space-y-2 shadow-sm">
                <span className="font-sans text-xs uppercase font-bold tracking-wider block text-white/90">
                  Itens adicionados à sua pauta de consulta:
                </span>
                <ul className="list-disc pl-5 font-sans text-sm space-y-1 break-words text-white">
                  {perguntasPauta.map((item, i) => (
                    <li key={i} className="font-medium">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ACESSO RÁPIDO AOS DEMAIS MÓDULOS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/diario"
          className="min-h-[56px] p-4 rounded-xl bg-clinical-action text-white font-serif text-base font-bold flex items-center justify-between hover:bg-clinical-ink transition-all shadow-sm"
        >
          <span>Anotar no meu diário</span>
          <span className="text-xl ml-2">→</span>
        </Link>
        <Link
          href="/agenda"
          className="min-h-[56px] p-4 rounded-xl bg-clinical-surface text-clinical-ink font-serif text-base font-bold flex items-center justify-between hover:bg-clinical-ink hover:text-white transition-all shadow-sm"
        >
          <span>Minhas consultas</span>
          <span className="text-xl ml-2">→</span>
        </Link>
        <Link
          href="/comunidade"
          className="min-h-[56px] p-4 rounded-xl bg-clinical-ink text-white font-serif text-base font-bold flex items-center justify-between hover:bg-clinical-action transition-all shadow-sm"
        >
          <span>Papo privado acolhedor</span>
          <span className="text-xl ml-2">→</span>
        </Link>
      </section>
    </div>
  );
}
