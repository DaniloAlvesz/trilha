"use client";

import React from "react";

export default function RelatorioPrintPage() {
  const dadosRelatorio = {
    pacienteId: "BR-ONCO-9482-SUS",
    dataEmissao: new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    proximaConsulta: "17/09/2026",
    oncologistaResponsavel: "DR(A). EQUIPE DE ONCOLOGIA CLÍNICA",
    medicacao: {
      farmaco: "TAMOXIFENO",
      dosagem: "20MG / DIA (VIA ORAL)",
      periodo: "MÊS 14 DE 60 (PROTOCOLO 5 ANOS)",
      adesaoPercentual: "96.7%",
      dosesOmitidas: "1 DOSE NOS ÚLTIMOS 30 DIAS",
      estoqueRestante: "4 COMPRIMIDOS (RENOVAÇÃO DE RECEITA NECESSÁRIA)",
    },
    sintomasRecorrentes: [
      {
        sintoma: "FADIGA INTENSA MATINAL",
        codigoLOINC: "LOINC 88020-3",
        ocorrencias90Dias: 4,
        observacao: "DIFICULDADE SEVERA DE DESPERTAR NAS PRIMEIRAS 2 HORAS.",
      },
      {
        sintoma: "EDEMA / PESO NO MEMBRO SUPERIOR ESQUERDO",
        codigoLOINC: "SNOMED 444062002",
        ocorrencias90Dias: 3,
        observacao: "SENSAÇÃO DE APERTO EM MANGAS. PERÍMETRO ESTÁVEL EM FISIOTERAPIA.",
      },
      {
        sintoma: "ONDA DE CALOR (FOGACHO MADRUGADA)",
        codigoLOINC: "LOINC 9279-1",
        ocorrencias90Dias: 8,
        observacao: "DESPERTARES FREQUENTES ENTRE 02H00 E 04H00.",
      },
    ],
    pautaPerguntas: [
      "1. AVALIAR AJUSTE DE HORÁRIO DO TAMOXIFENO PARA AMENIZAR FOGACHOS NOTURNOS.",
      "2. SOLICITAÇÃO DE GUIA DE RENOVAÇÃO PARA FISIOTERAPIA DO LINFEDEMA DO BRAÇO ESQUERDO.",
      "3. RENOVAÇÃO DA RECEITA MÉDICA CONTROLADA PARA OS PRÓXIMOS 6 MESES.",
    ],
    examesRealizadosPeriodo: [
      {
        exame: "MAMOGRAFIA DIGITAL BILATERAL",
        data: "14/09/2026",
        status: "AGUARDANDO LAUDO / REALIZADO",
      },
      {
        exame: "HEMOGRAMA COMPLETO + PERFIL LIPÍDICO",
        data: "28/08/2026",
        status: "RESULTADOS DENTRO DOS LIMITES DE REFERÊNCIA",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Botões de Ação na Tela (Ocultos no Print) */}
      <div className="no-print rounded-2xl border border-clinical-ink/20 bg-clinical-paper text-clinical-ink p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <span className="font-sans text-xs font-semibold text-clinical-action uppercase tracking-wider block">
            Resumo preparado para sua consulta
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink mt-0.5">
            Relatório de Acompanhamento Médico
          </h1>
          <p className="font-sans text-xs sm:text-sm text-clinical-ink/80 mt-1">
            Este documento reúne seus sintomas, adesão e dúvidas para levar impresso ao oncologista ou mostrar no celular.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full md:w-auto min-h-[48px] px-6 rounded-xl bg-clinical-action text-white font-sans text-sm sm:text-base font-bold hover:bg-clinical-ink transition-all shadow-sm text-center shrink-0"
        >
          Imprimir ou Salvar em PDF (Ctrl + P)
        </button>
      </div>

      {/* DOCUMENTO OFICIAL IMPRESSO (PADRÃO SUS / CADERNETA FÍSICA) */}
      <div className="bg-white text-clinical-ink p-5 sm:p-8 md:p-10 rounded-2xl border border-clinical-ink/20 font-sans text-xs sm:text-sm leading-relaxed space-y-6 shadow-sm">
        {/* Cabeçalho Oficial */}
        <header className="border-b-2 border-clinical-ink pb-4 text-center">
          <div className="font-sans text-xs font-semibold uppercase tracking-widest text-clinical-ink/70">
            Ministério da Saúde • Sistema Único de Saúde (SUS)
          </div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mt-1 break-words">
            Relatório de Acompanhamento de Sobreaviso Oncológico
          </h2>
          <div className="font-sans text-xs text-clinical-ink/70 mt-1">
            Protocolo Trilha • Cuidado Contínuo e Qualidade de Vida no Seguimento
          </div>
        </header>

        {/* Metadados do Paciente e Consulta */}
        <section className="rounded-xl border border-clinical-ink/20 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-clinical-paper">
          <div>
            <span className="font-semibold block text-xs text-clinical-ink/70">Código anônimo da paciente:</span>
            <span className="text-sm sm:text-base font-bold break-words">{dadosRelatorio.pacienteId}</span>
          </div>
          <div>
            <span className="font-semibold block text-xs text-clinical-ink/70">Data de emissão:</span>
            <span className="text-sm sm:text-base font-bold">{dadosRelatorio.dataEmissao}</span>
          </div>
          <div>
            <span className="font-semibold block text-xs text-clinical-ink/70">Data da consulta médica:</span>
            <span className="text-sm sm:text-base font-bold">{dadosRelatorio.proximaConsulta}</span>
          </div>
        </section>

        {/* Bloco 1: Adesão Farmacológica */}
        <section className="space-y-2">
          <h3 className="font-serif text-base sm:text-lg font-bold border-b border-clinical-ink/20 pb-1 break-words text-clinical-ink">
            1. Hormonioterapia e Regularidade da Medicação
          </h3>
          <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1">
            <table className="w-full min-w-[320px] border-collapse border border-clinical-ink/30 text-left rounded-lg overflow-hidden">
              <tbody>
                <tr className="border-b border-clinical-ink/20">
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold w-1/3 bg-clinical-paper text-xs sm:text-sm">Medicamento prescrito:</th>
                  <td className="p-2.5 font-bold text-xs sm:text-sm">{dadosRelatorio.medicacao.farmaco}</td>
                </tr>
                <tr className="border-b border-clinical-ink/20">
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold bg-clinical-paper text-xs sm:text-sm">Posologia diária:</th>
                  <td className="p-2.5 text-xs sm:text-sm">{dadosRelatorio.medicacao.dosagem}</td>
                </tr>
                <tr className="border-b border-clinical-ink/20">
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold bg-clinical-paper text-xs sm:text-sm">Tempo de tratamento:</th>
                  <td className="p-2.5 text-xs sm:text-sm">{dadosRelatorio.medicacao.periodo}</td>
                </tr>
                <tr className="border-b border-clinical-ink/20">
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold bg-clinical-paper text-xs sm:text-sm">Índice de regularidade (adesão):</th>
                  <td className="p-2.5 font-bold text-xs sm:text-sm">{dadosRelatorio.medicacao.adesaoPercentual} ({dadosRelatorio.medicacao.dosesOmitidas})</td>
                </tr>
                <tr>
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold bg-clinical-paper text-xs sm:text-sm">Comprimidos restantes na caixa:</th>
                  <td className="p-2.5 font-bold text-clinical-alert text-xs sm:text-sm">{dadosRelatorio.medicacao.estoqueRestante}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bloco 2: Monitoramento de Sintomas */}
        <section className="space-y-2">
          <h3 className="font-serif text-base sm:text-lg font-bold border-b border-clinical-ink/20 pb-1 break-words text-clinical-ink">
            2. Sintomas Relatados nos Últimos 90 Dias
          </h3>
          <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1">
            <table className="w-full min-w-[500px] border-collapse border border-clinical-ink/30 text-left rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-clinical-ink/20 bg-clinical-paper">
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold text-xs">Sintoma</th>
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold text-xs">Código Clínico</th>
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold text-xs">Frequência</th>
                  <th className="p-2.5 font-semibold text-xs">Observação anotada</th>
                </tr>
              </thead>
              <tbody>
                {dadosRelatorio.sintomasRecorrentes.map((s, idx) => (
                  <tr key={idx} className="border-b border-clinical-ink/15 last:border-0">
                    <td className="p-2.5 border-r border-clinical-ink/15 font-semibold text-xs sm:text-sm">{s.sintoma}</td>
                    <td className="p-2.5 border-r border-clinical-ink/15 text-xs text-clinical-ink/70">{s.codigoLOINC}</td>
                    <td className="p-2.5 border-r border-clinical-ink/15 font-bold text-center text-xs sm:text-sm">{s.ocorrencias90Dias} vezes</td>
                    <td className="p-2.5 text-xs">{s.observacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bloco 3: Pauta Estruturada de Dúvidas */}
        <section className="space-y-2">
          <h3 className="font-serif text-base sm:text-lg font-bold border-b border-clinical-ink/20 pb-1 break-words text-clinical-ink">
            3. Dúvidas e Demandas da Paciente para a Consulta
          </h3>
          <div className="rounded-xl border border-clinical-ink/20 p-4 space-y-2 bg-clinical-paper">
            {dadosRelatorio.pautaPerguntas.map((pauta, idx) => (
              <div key={idx} className="font-medium text-xs sm:text-sm break-words">
                {pauta}
              </div>
            ))}
          </div>
        </section>

        {/* Bloco 4: Histórico de Exames de Controle */}
        <section className="space-y-2">
          <h3 className="font-serif text-base sm:text-lg font-bold border-b border-clinical-ink/20 pb-1 break-words text-clinical-ink">
            4. Exames e Procedimentos Complementares
          </h3>
          <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1">
            <table className="w-full min-w-[450px] border-collapse border border-clinical-ink/30 text-left rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-clinical-ink/20 bg-clinical-paper">
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold text-xs">Exame / Procedimento</th>
                  <th className="p-2.5 border-r border-clinical-ink/20 font-semibold text-xs">Data</th>
                  <th className="p-2.5 font-semibold text-xs">Situação</th>
                </tr>
              </thead>
              <tbody>
                {dadosRelatorio.examesRealizadosPeriodo.map((ex, idx) => (
                  <tr key={idx} className="border-b border-clinical-ink/15 last:border-0">
                    <td className="p-2.5 border-r border-clinical-ink/15 font-semibold text-xs sm:text-sm">{ex.exame}</td>
                    <td className="p-2.5 border-r border-clinical-ink/15 text-xs sm:text-sm">{ex.data}</td>
                    <td className="p-2.5 text-xs sm:text-sm">{ex.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Campo para Anotações do Médico Oncologista */}
        <section className="rounded-xl border border-clinical-ink/20 p-4 space-y-4">
          <span className="font-semibold block text-xs text-clinical-ink/80">
            Espaço reservado para conduta e anotações do médico assistente:
          </span>
          <div className="border-b border-clinical-ink/30 h-7"></div>
          <div className="border-b border-clinical-ink/30 h-7"></div>
          <div className="border-b border-clinical-ink/30 h-7"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pt-2">
            <div className="text-xs break-words">
              Assinatura e carimbo (CRM): <span className="inline-block border-b border-clinical-ink w-40 sm:w-56 align-bottom"></span>
            </div>
            <div className="text-xs">Data: ____/____/2026</div>
          </div>
        </section>
      </div>
    </div>
  );
}
