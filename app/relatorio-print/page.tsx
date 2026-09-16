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
      <div className="no-print border-4 border-clinical-ink bg-clinical-paper text-clinical-ink p-3 sm:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div>
          <span className="font-mono text-[10px] sm:text-xs uppercase font-bold text-clinical-action block">
            MOTOR 1 // PRÉ-VISUALIZAÇÃO DE DOCUMENTO OFICIAL A4
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-black uppercase break-words text-clinical-ink">
            RELATÓRIO CLÍNICO PARA CONSULTA MÉDICA
          </h1>
          <p className="font-mono text-xs sm:text-sm uppercase mt-0.5 text-clinical-ink">
            ESTE LAYOUT FOI COMPILADO PARA IMPRESSÃO EM PAPEL FÍSICO COM ALTO CONTRASTE P&amp;B.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full md:w-auto min-h-[48px] px-6 sm:px-8 bg-clinical-action text-white font-mono text-sm sm:text-base font-black uppercase border-2 border-clinical-ink hover:bg-clinical-ink hover:text-white transition-none text-center shrink-0"
        >
          IMPRIMIR EM PAPEL A4 (CTRL + P)
        </button>
      </div>

      {/* DOCUMENTO OFICIAL IMPRESSO (PADRÃO SUS / CADERNETA FÍSICA) */}
      <div className="bg-white text-clinical-ink p-3.5 sm:p-6 md:p-10 border-4 border-clinical-ink font-mono text-xs sm:text-sm leading-relaxed space-y-6">
        {/* Cabeçalho Oficial */}
        <header className="border-b-4 border-clinical-ink pb-4 text-center">
          <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            MINISTÉRIO DA SAÚDE // SISTEMA ÚNICO DE SAÚDE (SUS)
          </div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-black uppercase mt-1 break-words">
            RELATÓRIO CONSOLIDADO DE SOBREVIDA ONCOLÓGICA
          </h2>
          <div className="font-mono text-[10px] sm:text-xs font-bold uppercase mt-1">
            PROTOCOLO TRILHA • COORTE DE SEGUIMENTO DE CÂNCER DE MAMA
          </div>
        </header>

        {/* Metadados do Paciente e Consulta */}
        <section className="border-2 border-clinical-ink p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <span className="font-bold block text-[10px] sm:text-xs uppercase">IDENTIFICADOR ANÔNIMO:</span>
            <span className="text-sm sm:text-base font-black break-words">{dadosRelatorio.pacienteId}</span>
          </div>
          <div>
            <span className="font-bold block text-[10px] sm:text-xs uppercase">DATA DA EMISSÃO:</span>
            <span className="text-sm sm:text-base font-black">{dadosRelatorio.dataEmissao}</span>
          </div>
          <div>
            <span className="font-bold block text-[10px] sm:text-xs uppercase">DATA DA CONSULTA:</span>
            <span className="text-sm sm:text-base font-black">{dadosRelatorio.proximaConsulta}</span>
          </div>
        </section>

        {/* Bloco 1: Adesão Farmacológica (MedicationStatement) */}
        <section className="space-y-2">
          <h3 className="font-serif text-base sm:text-lg font-black uppercase border-b-2 border-clinical-ink pb-1 break-words text-clinical-ink">
            1. HORMONIOTERAPIA ADJUVANTE &amp; ADESÃO FARMACOLÓGICA
          </h3>
          <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1">
            <table className="w-full min-w-[320px] border-collapse border-2 border-clinical-ink text-left">
              <tbody>
                <tr className="border-b border-clinical-ink">
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase w-1/3 bg-clinical-paper text-clinical-ink text-xs sm:text-sm">FÁRMACO PRESCRITO:</th>
                  <td className="p-2 font-black text-xs sm:text-sm">{dadosRelatorio.medicacao.farmaco}</td>
                </tr>
                <tr className="border-b border-clinical-ink">
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase bg-clinical-paper text-clinical-ink text-xs sm:text-sm">POSOLOGIA REGISTRADA:</th>
                  <td className="p-2 text-xs sm:text-sm">{dadosRelatorio.medicacao.dosagem}</td>
                </tr>
                <tr className="border-b border-clinical-ink">
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase bg-clinical-paper text-clinical-ink text-xs sm:text-sm">FASE DO TRATAMENTO:</th>
                  <td className="p-2 text-xs sm:text-sm">{dadosRelatorio.medicacao.periodo}</td>
                </tr>
                <tr className="border-b border-clinical-ink">
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase bg-clinical-paper text-clinical-ink text-xs sm:text-sm">ÍNDICE DE ADESÃO (RWD):</th>
                  <td className="p-2 font-black text-xs sm:text-sm">{dadosRelatorio.medicacao.adesaoPercentual} ({dadosRelatorio.medicacao.dosesOmitidas})</td>
                </tr>
                <tr>
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase bg-clinical-paper text-clinical-ink text-xs sm:text-sm">ESTOQUE FÍSICO RESTANTE:</th>
                  <td className="p-2 font-black text-clinical-alert text-xs sm:text-sm">{dadosRelatorio.medicacao.estoqueRestante}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bloco 2: Monitoramento de Sintomas e Sinais de Alerta (Observations) */}
        <section className="space-y-2">
          <h3 className="font-serif text-base sm:text-lg font-black uppercase border-b-2 border-clinical-ink pb-1 break-words text-clinical-ink">
            2. RECORRÊNCIA DE SINTOMAS CLÍNICOS (ÚLTIMOS 90 DIAS)
          </h3>
          <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1">
            <table className="w-full min-w-[500px] border-collapse border-2 border-clinical-ink text-left">
              <thead>
                <tr className="border-b-2 border-clinical-ink bg-clinical-paper text-clinical-ink">
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase text-xs">SINTOMA CLÍNICO</th>
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase text-xs">SISTEMA</th>
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase text-xs">FREQUÊNCIA</th>
                  <th className="p-2 font-bold uppercase text-xs">OBSERVAÇÃO REGISTRADA</th>
                </tr>
              </thead>
              <tbody>
                {dadosRelatorio.sintomasRecorrentes.map((s, idx) => (
                  <tr key={idx} className="border-b border-clinical-ink last:border-0">
                    <td className="p-2 border-r border-clinical-ink font-bold text-xs sm:text-sm">{s.sintoma}</td>
                    <td className="p-2 border-r border-clinical-ink text-xs">{s.codigoLOINC}</td>
                    <td className="p-2 border-r border-clinical-ink font-black text-center text-xs sm:text-sm">{s.ocorrencias90Dias}X</td>
                    <td className="p-2 text-xs">{s.observacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bloco 3: Pauta Estruturada de Dúvidas para o Consultório (Motor 2) */}
        <section className="space-y-2">
          <h3 className="font-serif text-base sm:text-lg font-black uppercase border-b-2 border-clinical-ink pb-1 break-words text-clinical-ink">
            3. PAUTA ESTRUTURADA DE DÚVIDAS E DEMANDAS DA PACIENTE
          </h3>
          <div className="border-2 border-clinical-ink p-3 sm:p-4 space-y-2 bg-clinical-paper text-clinical-ink">
            {dadosRelatorio.pautaPerguntas.map((pauta, idx) => (
              <div key={idx} className="font-bold text-xs sm:text-sm break-words">
                {pauta}
              </div>
            ))}
          </div>
        </section>

        {/* Bloco 4: Histórico de Exames de Controle (Encounters) */}
        <section className="space-y-2">
          <h3 className="font-serif text-base sm:text-lg font-black uppercase border-b-2 border-clinical-ink pb-1 break-words text-clinical-ink">
            4. EXAMES E PROCEDIMENTOS COMPLEMENTARES
          </h3>
          <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1">
            <table className="w-full min-w-[450px] border-collapse border-2 border-clinical-ink text-left">
              <thead>
                <tr className="border-b-2 border-clinical-ink bg-clinical-paper text-clinical-ink">
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase text-xs">EXAME / PROCEDIMENTO</th>
                  <th className="p-2 border-r border-clinical-ink font-bold uppercase text-xs">DATA</th>
                  <th className="p-2 font-bold uppercase text-xs">STATUS DOCUMENTAL</th>
                </tr>
              </thead>
              <tbody>
                {dadosRelatorio.examesRealizadosPeriodo.map((ex, idx) => (
                  <tr key={idx} className="border-b border-clinical-ink last:border-0">
                    <td className="p-2 border-r border-clinical-ink font-bold text-xs sm:text-sm">{ex.exame}</td>
                    <td className="p-2 border-r border-clinical-ink text-xs sm:text-sm">{ex.data}</td>
                    <td className="p-2 text-xs sm:text-sm">{ex.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Campo para Anotações do Médico Oncologista */}
        <section className="border-2 border-clinical-ink p-3 sm:p-4 space-y-5">
          <span className="font-bold uppercase block text-xs">
            ESPAÇO RESERVADO PARA CONDUTA E ANOTAÇÕES DO MÉDICO ASSISTENTE:
          </span>
          <div className="border-b border-clinical-ink h-8"></div>
          <div className="border-b border-clinical-ink h-8"></div>
          <div className="border-b border-clinical-ink h-8"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pt-3">
            <div className="text-xs break-words">
              ASSINATURA E CARIMBO (CRM): <span className="inline-block border-b border-clinical-ink w-40 sm:w-56 align-bottom"></span>
            </div>
            <div className="text-xs">DATA: ____/____/2026</div>
          </div>
        </section>
      </div>
    </div>
  );
}
