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
      {/* Cabeçalho Acolhedor */}
      <section className="bg-clinical-paper border border-clinical-surface/40 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-0.5">
          <span className="font-sans text-xs sm:text-sm text-clinical-ink/70 block capitalize">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-clinical-action">
            Bom dia. Como você está?
          </h2>
          <p className="font-sans text-xs sm:text-sm text-clinical-ink/80">
            Estamos com você em cada etapa do seu caminho.
          </p>
        </div>
        <div className="rounded-full bg-clinical-surface/20 text-clinical-ink font-sans text-xs font-semibold px-3.5 py-1.5 border border-clinical-ink/10 shrink-0">
          {statusLog.replace(/^\[|\]$/g, "")}
        </div>
      </section>

      {/* CARD DE PROGRESSO: ANEL CIRCULAR (EFEITO DE ENQUADRAMENTO & CUSTO AFUNDADO) */}
      <section className="rounded-3xl border border-clinical-surface/30 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          {/* Anel de Progresso Circular SVG */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Círculo de fundo */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#FDF8F9"
                strokeWidth="10"
                className="stroke-clinical-paper"
              />
              {/* Anel de preenchimento */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#801A3D"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={314.16}
                strokeDashoffset={314.16 * (1 - 14 / 60)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-clinical-action leading-none">
                14/60
              </span>
              <span className="text-[11px] font-sans font-semibold text-clinical-ink/70 uppercase tracking-wider mt-0.5">
                Meses
              </span>
            </div>
          </div>

          {/* Textos Motivacionais e Reforço Positivo */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-clinical-success/15 text-clinical-ink border border-clinical-success/40 px-3 py-1 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-clinical-success animate-pulse" />
              96,7% de adesão contínua
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
              Mês 14 de 60 concluídos
            </h3>
            <p className="text-sm font-sans text-clinical-ink/85 leading-relaxed">
              Você já superou mais de 1 ano completo de tratamento! Cada comprimido tomado e cada dia vencido fortalecem sua proteção a longo prazo. O seu empenho diário está gerando frutos admiráveis.
            </p>
          </div>
        </div>
      </section>

      {/* AÇÃO DO MEDICAMENTO: BOTÃO GRANDE NA ZONA DO POLEGAR (THUMB ZONE) */}
      <section className="rounded-3xl border border-clinical-surface/30 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-clinical-surface/20 pb-3">
          <div>
            <span className="font-sans text-xs text-clinical-ink/70 font-semibold block">
              Medicamento de Uso Contínuo
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
              Tamoxifeno 20mg
            </h2>
          </div>
          <div className="text-xs sm:text-sm font-sans text-clinical-ink/80 bg-clinical-paper px-3 py-1.5 rounded-full border border-clinical-surface/30 font-medium">
            1 comprimido ao dia pela manhã
          </div>
        </div>

        {/* Lembrete amigável de renovação de receita */}
        {motorState.motor3CriticalAlert && (
          <div className="rounded-2xl bg-clinical-paper border border-clinical-alert/30 p-4 flex items-start gap-3 text-clinical-ink">
            <span className="text-2xl shrink-0">💌</span>
            <div className="text-xs sm:text-sm leading-relaxed space-y-1">
              <p className="font-bold text-clinical-action">
                Faltam 4 dias para concluir esta caixa. Vamos renovar a receita?
              </p>
              <p className="text-clinical-ink/80">
                Você tem mantido sua rotina com ótima regularidade! Como restam {motorState.motor3SupplyDaysLeft} comprimidos, é o momento perfeito para agendar a retirada ou solicitar ao médico.
              </p>
            </div>
          </div>
        )}

        {/* Botão Grande de Ação Rápida (Thumb Zone - Min 56px altura) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleToggleDose}
            className={`w-full min-h-[60px] p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] select-none ${
              doseIngeridaHoje
                ? "bg-clinical-success text-white border-clinical-success"
                : "bg-clinical-action text-white border-clinical-action hover:bg-clinical-action/95"
            }`}
            aria-pressed={doseIngeridaHoje}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-sans text-2xl font-bold transition-all ${
                  doseIngeridaHoje
                    ? "bg-white text-clinical-success shadow-sm"
                    : "bg-white/20 text-white"
                }`}
              >
                {doseIngeridaHoje ? "✓" : "💊"}
              </div>
              <div className="min-w-0">
                <span className="font-sans text-xs block font-semibold opacity-90">
                  {doseIngeridaHoje ? "Dose do dia confirmada!" : "Ação diária recomendada"}
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold break-words block leading-snug">
                  {doseIngeridaHoje
                    ? "Dose de hoje concluída com sucesso!"
                    : "Tomei minha dose hoje"}
                </span>
              </div>
            </div>

            <span className="text-xs font-sans font-bold underline shrink-0 opacity-85 hidden sm:inline">
              {doseIngeridaHoje ? "Alterar" : "Confirmar"}
            </span>
          </button>
        </div>
      </section>

      {/* GESTÃO DE ANSIEDADE PRÉ-EXAME (SCANXIETY): REENQUADRAR O MEDO EM CONTROLE */}
      {motorState.motor4ScanxietyActive && (
        <section className="rounded-3xl border border-clinical-action/25 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-clinical-surface/20 text-clinical-action px-3 py-1 font-sans text-xs font-bold">
              <span>🩺</span>
              Acolhimento Pré-Exame
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-action break-words">
              Sua {motorState.motor4ExamType?.toLowerCase() || "mamografia"} é em {motorState.motor4ExamDaysLeft} dias. Quer anotar alguma dúvida para não esquecer de perguntar ao médico?
            </h2>
            <p className="text-sm font-sans text-clinical-ink/85 leading-relaxed">
              Sentir apreensão antes de exames de rotina é uma reação muito natural e compreensível. Anotar suas perguntas traz calma e coloca você no comando da conversa com seu médico.
            </p>

            {!scanxietyRegistrado ? (
              <div className="rounded-2xl border border-clinical-surface/30 p-4 sm:p-5 bg-clinical-paper space-y-3.5 mt-3 shadow-inner">
                <label className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink">
                  Como está seu coração hoje? Toque em um sentimento para registrar:
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
                      className="min-h-[44px] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-sans font-medium bg-white text-clinical-ink border border-clinical-surface/40 hover:bg-clinical-action hover:text-white transition-all active:scale-95 shadow-xs"
                    >
                      + {sensacao}
                    </button>
                  ))}
                </div>

                <div>
                  <label htmlFor="scanxiety-input" className="block font-sans text-xs text-clinical-ink/80 mt-2 mb-1">
                    Dúvidas ou anotações que você quer lembrar na hora do exame:
                  </label>
                  <textarea
                    id="scanxiety-input"
                    value={scanxietyNota}
                    onChange={(e) => setScanxietyNota(e.target.value)}
                    placeholder="Ex: Perguntar sobre o inchaço leve no braço ou se preciso repetir o ultrassom..."
                    className="w-full p-3 rounded-xl border border-clinical-ink/20 font-sans text-sm min-h-[84px] bg-white text-clinical-ink focus:outline-none focus:ring-2 focus:ring-clinical-action/30"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setScanxietyRegistrado(true);
                    setStatusLog("Check-in de acolhimento salvo com carinho");
                  }}
                  className="w-full sm:w-auto min-h-[48px] rounded-xl px-6 py-3 bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-ink transition-all shadow-sm active:scale-95"
                >
                  Salvar anotações para a consulta
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-clinical-success/30 p-4 bg-clinical-success text-white font-sans text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2">
                <span className="text-xl">✓</span>
                <span>Suas anotações foram salvas com carinho. Respire fundo: você está cuidando perfeitamente de si mesma.</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ATALHOS RÁPIDOS INTEGRADOS: CONSULTAS & RELATÓRIO DO MÉDICO */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/agenda"
          className="group rounded-3xl border border-clinical-surface/30 bg-white p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-2xl bg-clinical-surface/20 text-clinical-action flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
            📅
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-clinical-action block">
              Agenda de Saúde
            </span>
            <h3 className="font-serif text-lg font-bold text-clinical-ink group-hover:text-clinical-action transition-colors">
              Minhas Consultas e Exames
            </h3>
            <p className="text-xs font-sans text-clinical-ink/75 leading-relaxed">
              Próximo: Mamografia em {motorState.motor4ExamDaysLeft} dias. Toque para ver ou agendar.
            </p>
          </div>
        </Link>

        <Link
          href="/relatorio-print"
          className="group rounded-3xl border border-clinical-surface/30 bg-white p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-2xl bg-clinical-action text-white flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
            📋
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-clinical-action block">
              Pronto para Levar
            </span>
            <h3 className="font-serif text-lg font-bold text-clinical-ink group-hover:text-clinical-action transition-colors">
              Relatório para Consulta
            </h3>
            <p className="text-xs font-sans text-clinical-ink/75 leading-relaxed">
              Resumo completo de sintomas e adesão para apresentar ao seu médico oncologista.
            </p>
          </div>
        </Link>
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
                    className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl bg-clinical-action text-white font-sans text-xs sm:text-sm font-bold hover:bg-clinical-ink transition-all shadow-sm text-center"
                  >
                    Sim, adicionar à lista
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRecusarPauta(pergunta)}
                    className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl bg-clinical-surface text-clinical-ink font-sans text-xs sm:text-sm font-semibold hover:bg-clinical-ink hover:text-white transition-all text-center"
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
