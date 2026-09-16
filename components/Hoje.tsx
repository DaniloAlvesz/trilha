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
      {/* Banner de Estado do Prontuário / Sistema */}
      <section className="bg-clinical-ink text-white p-3 border-2 border-clinical-ink flex flex-col md:flex-row justify-between items-start md:items-center font-mono text-xs sm:text-sm md:text-base gap-2 break-words">
        <div className="font-bold uppercase tracking-wider">
          COMPETÊNCIA ATUAL: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}
        </div>
        <div className="text-clinical-surface font-bold break-words">
          {statusLog}
        </div>
      </section>

      {/* MOTOR 3: BANNER DE ALERTA LOGÍSTICO CRÍTICO (SE DIAS RESTANTES <= 5) */}
      {motorState.motor3CriticalAlert && (
        <section
          role="alert"
          aria-live="assertive"
          className="bg-clinical-alert text-white border-4 border-clinical-ink p-4 sm:p-5"
        >
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest bg-clinical-ink text-white px-2 py-1 max-w-full inline-block">
              PRIORIDADE MÁXIMA // MOTOR LOGÍSTICO (D-5)
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-black uppercase break-words text-white">
              ESTOQUE CRÍTICO: RESTAM APENAS {motorState.motor3SupplyDaysLeft} DIAS DE MEDICAMENTO
            </h2>
            <p className="text-sm sm:text-base font-bold font-sans text-white">
              O suprimento de Tamoxifeno 20mg atingiu o limiar de risco de descontinuidade. É obrigatório providenciar a renovação da receita médica e o levantamento de nova caixa no centro de dispensação oncológica (SUS / Farmácia de Alto Custo).
            </p>
            <div className="font-mono text-xs sm:text-sm font-bold border-2 border-clinical-ink p-2 bg-clinical-paper text-clinical-ink w-full sm:w-auto max-w-full break-words block sm:inline-block">
              CÁLCULO MATEMÁTICO: ({motorState.motor3TotalSupply} TOTAL - {motorState.motor3DosesTaken} TOMADAS) / 1 PÍLULA/DIA = {motorState.motor3SupplyDaysLeft} DIAS
            </div>
          </div>
        </section>
      )}

      {/* MOTOR 4: CHECK-IN PREVENTIVO DE ANSIEDADE CLÍNICA (SCANXIETY - D-3) */}
      {motorState.motor4ScanxietyActive && (
        <section className="border-4 border-clinical-action bg-clinical-paper p-4 sm:p-5">
          <div className="flex flex-col gap-3">
            <div className="bg-clinical-action text-white font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-1 max-w-full inline-block">
              MOTOR 4 // INTERVENÇÃO EMOCIONAL: SCANXIETY (D-{motorState.motor4ExamDaysLeft})
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-black uppercase text-clinical-action break-words">
              CONTROLE CLÍNICO PRÓXIMO: {motorState.motor4ExamType} EM {motorState.motor4ExamDaysLeft} DIAS
            </h2>
            <p className="text-sm sm:text-base font-sans text-clinical-ink">
              A proximidade de exames de imagem e controle frequentemente induz o fenômeno documentado de <strong>ansiedade antecipatória (scanxiety)</strong>. Este é um processo fisiológico e psicológico esperado no seguimento oncológico.
            </p>

            {!scanxietyRegistrado ? (
              <div className="border-2 border-clinical-ink p-3 sm:p-4 bg-white space-y-3">
                <label htmlFor="scanxiety-input" className="block font-mono text-xs sm:text-sm font-bold uppercase text-clinical-ink">
                  REGISTRO DE TENSÃO SOMÁTICA OU PENSAMENTOS INTRUSIVOS (OPCIONAL):
                </label>
                <textarea
                  id="scanxiety-input"
                  value={scanxietyNota}
                  onChange={(e) => setScanxietyNota(e.target.value)}
                  placeholder="DIGITE AQUI SUAS PERCEPÇÕES CORPÓREAS OU NÍVEL DE APREENSÃO..."
                  className="w-full p-3 border-2 border-clinical-ink font-mono text-sm sm:text-base min-h-[96px] bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setScanxietyRegistrado(true);
                    setStatusLog("[OBSERVAÇÃO ARQUIVADA: CHECK-IN SCANXIETY CONCLUÍDO]");
                  }}
                  className="w-full sm:w-auto min-h-[48px] px-4 sm:px-6 bg-clinical-action text-white font-mono text-xs sm:text-sm font-bold uppercase border-2 border-clinical-ink hover:bg-clinical-ink hover:text-white transition-none text-center"
                >
                  ARQUIVAR CHECK-IN DE DESCOMPRESSÃO
                </button>
              </div>
            ) : (
              <div className="border-2 border-clinical-ink p-3 bg-clinical-success text-white font-mono text-xs sm:text-sm font-bold uppercase break-words">
                [CHECK-IN DE SCANXIETY REGISTRADO NO PRONTUÁRIO INDIVIDUAL]
              </div>
            )}
          </div>
        </section>
      )}

      {/* MOTOR 1: GATILHO DE RELATÓRIO AUTOMÁTICO DE CONSULTA (D-7) */}
      {motorState.motor1ReportReady && (
        <section className="border-4 border-clinical-action bg-clinical-paper p-4 sm:p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="bg-clinical-action text-white font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-1 max-w-full inline-block">
                MOTOR 1 // PROTOCOLO DE CONSULTA ONCOLÓGICA (D-{motorState.motor1NextEncounterDays})
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-black uppercase text-clinical-action break-words">
                CONSULTA MÉDICA PROGRAMADA PARA {motorState.motor1NextEncounterDate}
              </h2>
              <p className="text-sm sm:text-base font-sans text-clinical-ink">
                O compilador agregou todas as observações, sintomas e histórico de adesão farmacológica acumulados desde o último retorno. O relatório impresso A4 está pronto para o médico oncologista.
              </p>
            </div>
            <Link
              href="/relatorio-print"
              className="w-full md:w-auto flex-shrink-0 min-h-[48px] px-4 sm:px-6 py-3 bg-clinical-action text-white font-mono text-xs sm:text-sm md:text-base font-black uppercase border-2 border-clinical-ink inline-flex items-center justify-center hover:bg-clinical-ink hover:text-white transition-none text-center"
            >
              VISUALIZAR / IMPRIMIR RELATÓRIO A4
            </Link>
          </div>
        </section>
      )}

      {/* MÓDULO PRIMÁRIO: GESTÃO DIÁRIA DE HORMONIOTERAPIA (MEDICATIONSTATEMENT) */}
      <section className="border-2 border-clinical-ink bg-clinical-paper p-4 sm:p-5 space-y-4">
        <div className="border-b-2 border-clinical-ink pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="font-mono text-xs uppercase text-clinical-ink font-bold">RECURSO: FHIR MedicationStatement</span>
            <h2 className="font-serif text-xl sm:text-2xl font-black uppercase text-clinical-ink">
              HORMONIOTERAPIA // DOSE DIÁRIA
            </h2>
          </div>
          <div className="font-mono text-xs sm:text-sm uppercase bg-clinical-ink text-white px-3 py-1 self-start sm:self-auto shrink-0">
            TAMOXIFENO 20MG • VIA ORAL
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 font-mono text-sm sm:text-base text-clinical-ink">
          <div className="border-2 border-clinical-ink p-3 bg-white">
            <span className="text-xs uppercase block font-bold">POSOLOGIA PRESCRITA:</span>
            <span className="text-base sm:text-lg font-black">1 COMPRIMIDO / DIA</span>
          </div>
          <div className="border-2 border-clinical-ink p-3 bg-white">
            <span className="text-xs uppercase block font-bold">TOTAL DA CAIXA:</span>
            <span className="text-base sm:text-lg font-black">{motorState.motor3TotalSupply} COMPRIMIDOS</span>
          </div>
          <div className="border-2 border-clinical-ink p-3 bg-white">
            <span className="text-xs uppercase block font-bold">SALDO RESTANTE:</span>
            <span className={`text-base sm:text-lg font-black ${motorState.motor3CriticalAlert ? "text-clinical-alert" : "text-clinical-ink"}`}>
              {motorState.motor3SupplyDaysLeft} DIAS DE TRATAMENTO
            </span>
          </div>
        </div>

        {/* ÁREA DE TOQUE OBRIGATÓRIA MÍNIMA PARA CHECKBOX */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleToggleDose}
            className={`w-full min-h-[56px] p-3 sm:p-4 border-4 border-clinical-ink text-left flex items-center gap-3 sm:gap-4 transition-none cursor-pointer ${
              doseIngeridaHoje
                ? "bg-clinical-success text-white"
                : "bg-white text-clinical-ink hover:bg-clinical-ink hover:text-white"
            }`}
            aria-pressed={doseIngeridaHoje}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 border-4 border-clinical-ink flex items-center justify-center font-mono text-xl sm:text-2xl font-black ${
                doseIngeridaHoje ? "bg-clinical-paper text-clinical-success" : "bg-clinical-paper text-transparent"
              }`}
            >
              ✓
            </div>
            <div className="min-w-0">
              <span className="font-mono text-[10px] sm:text-xs uppercase block font-bold tracking-wider">
                {doseIngeridaHoje ? "CONFIRMAÇÃO CLÍNICA ATIVA" : "AÇÃO PENDENTE HOJE"}
              </span>
              <span className="font-serif text-base sm:text-lg md:text-xl font-black uppercase break-words block">
                {doseIngeridaHoje
                  ? "DOSE DE HOJE JÁ INGERIDA COM SUCESSO"
                  : "CONFIRMAR INGESTÃO DA DOSE DIÁRIA (20MG)"}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* MOTOR 2: SUGESTÃO PROATIVA DE PERGUNTAS (NLP BASEADO EM REGRAS, FREQ >= 3 EM 90 DIAS) */}
      <section className="border-2 border-clinical-ink bg-clinical-paper p-4 sm:p-5 space-y-4">
        <div className="border-b-2 border-clinical-ink pb-2">
          <div className="bg-clinical-ink text-white font-mono text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 max-w-full inline-block">
            MOTOR 2 // ANÁLISE RECORRENTE DE SINTOMAS (LOINC / SNOMED-CT)
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-black uppercase mt-1 break-words text-clinical-ink">
            PAUTA AUTOMÁTICA PARA O ONCOLOGISTA (PREVENÇÃO DE ESQUECIMENTO)
          </h2>
        </div>

        {motorState.motor2SuggestedQuestions.length === 0 && perguntasPauta.length === 0 ? (
          <div className="border-2 border-clinical-ink p-3 sm:p-4 bg-white font-mono text-sm sm:text-base uppercase text-clinical-ink">
            [NENHUMA RECORRÊNCIA CLÍNICA COM FREQUÊNCIA SUPERIOR A 3 REGISTROS NESTA COMPETÊNCIA]
          </div>
        ) : (
          <div className="space-y-4">
            {motorState.motor2SuggestedQuestions.map((pergunta, idx) => (
              <div key={idx} className="border-2 border-clinical-ink p-3 sm:p-4 bg-white space-y-3">
                <div className="font-mono text-xs font-bold uppercase text-clinical-action">
                  PADRÃO IDENTIFICADO PELO ALGORITMO (OCORRÊNCIAS &gt;= 3 NOS ÚLTIMOS 90 DIAS):
                </div>
                <div className="font-serif text-base sm:text-lg font-bold break-words text-clinical-ink">
                  &ldquo;{pergunta}&rdquo;
                </div>
                <div className="font-sans text-sm sm:text-base font-bold text-clinical-ink">
                  Deseja adicionar este tópico diretamente ao resumo da sua próxima consulta médica?
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAdicionarPauta(pergunta)}
                    className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 sm:px-5 bg-clinical-action text-white font-mono text-xs sm:text-sm font-bold uppercase border-2 border-clinical-ink hover:bg-clinical-ink hover:text-white transition-none text-center"
                  >
                    SIM // ADICIONAR À PAUTA
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRecusarPauta(pergunta)}
                    className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 sm:px-5 bg-clinical-surface text-clinical-ink font-mono text-xs sm:text-sm font-bold uppercase border-2 border-clinical-ink hover:bg-clinical-ink hover:text-white transition-none text-center"
                  >
                    IGNORAR TÓPICO
                  </button>
                </div>
              </div>
            ))}

            {perguntasPauta.length > 0 && (
              <div className="border-2 border-clinical-ink p-3 sm:p-4 bg-clinical-action text-white space-y-2">
                <span className="font-mono text-xs uppercase font-bold tracking-widest block text-white">
                  ITENS CONFIRMADOS NA PAUTA MÉDICA:
                </span>
                <ul className="list-disc pl-5 font-mono text-sm sm:text-base space-y-1 break-words text-white">
                  {perguntasPauta.map((item, i) => (
                    <li key={i} className="font-bold">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ACESSO RÁPIDO AOS DEMAIS MÓDULOS ESSENCIAIS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/diario"
          className="min-h-[52px] sm:min-h-[64px] p-3 sm:p-4 bg-clinical-action text-white font-serif text-base sm:text-lg font-black uppercase border-2 border-clinical-ink flex items-center justify-between hover:bg-clinical-ink hover:text-white transition-none"
        >
          <span>MEU DIÁRIO // REGISTRAR SINTOMA</span>
          <span className="font-mono text-xl ml-2">→</span>
        </Link>
        <Link
          href="/agenda"
          className="min-h-[52px] sm:min-h-[64px] p-3 sm:p-4 bg-clinical-surface text-clinical-ink font-serif text-base sm:text-lg font-black uppercase border-2 border-clinical-ink flex items-center justify-between hover:bg-clinical-ink hover:text-white transition-none"
        >
          <span>MINHA AGENDA // ENCOUNTERS</span>
          <span className="font-mono text-xl ml-2">→</span>
        </Link>
        <Link
          href="/comunidade"
          className="min-h-[52px] sm:min-h-[64px] p-3 sm:p-4 bg-clinical-ink text-white font-serif text-base sm:text-lg font-black uppercase border-2 border-clinical-ink flex items-center justify-between hover:bg-clinical-surface hover:text-clinical-ink transition-none"
        >
          <span>PAPO PRIVADO // SALAS DE APOIO</span>
          <span className="font-mono text-xl ml-2">→</span>
        </Link>
      </section>
    </div>
  );
}
