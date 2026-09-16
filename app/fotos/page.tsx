"use client";

import React, { useState } from "react";
import { DocumentReferenceResource } from "@/types/clinical";

export default function LinhaDoTempoFotosPage() {
  const [fotos, setFotos] = useState<DocumentReferenceResource[]>([
    {
      resourceType: "DocumentReference",
      id: "doc-photo-001",
      subjectId: "pat-uuid-001",
      typeCode: "clinical-photo",
      contentAttachmentUrl: "https://encrypted-storage.trilha.saude.gov.br/pat-uuid-001/linfedema-baseline-2026-06.jpg",
      created: "2026-06-15T09:00:00-03:00",
      description: "AVALIAÇÃO DE SIMETRIA DO MEMBRO SUPERIOR ESQUERDO (BASELINE PÓS-CIRÚRGICO).",
    },
    {
      resourceType: "DocumentReference",
      id: "doc-photo-002",
      subjectId: "pat-uuid-001",
      typeCode: "clinical-photo",
      contentAttachmentUrl: "https://encrypted-storage.trilha.saude.gov.br/pat-uuid-001/linfedema-mes3-2026-09.jpg",
      created: "2026-09-01T14:30:00-03:00",
      description: "ACOMPANHAMENTO DE CICATRIZAÇÃO E EVOLUÇÃO DE EDEMA PÓS-DRENAGEM LINFÁTICA.",
    },
  ]);

  const [novaUrl, setNovaUrl] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [statusLog, setStatusLog] = useState("[REGISTRO CRONOLÓGICO DISPONÍVEL]");

  const handleSalvarFoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaUrl.trim() || !novaDescricao.trim()) {
      setStatusLog("[ERRO: URL DO ATTACHMENT E DESCRIÇÃO SÃO OBRIGATÓRIOS]");
      return;
    }

    const novoDoc: DocumentReferenceResource = {
      resourceType: "DocumentReference",
      id: `doc-photo-${Date.now()}`,
      subjectId: "pat-uuid-001",
      typeCode: "clinical-photo",
      contentAttachmentUrl: novaUrl.trim(),
      created: new Date().toISOString(),
      description: novaDescricao.trim().toUpperCase(),
    };

    setFotos([novoDoc, ...fotos]);
    setNovaUrl("");
    setNovaDescricao("");
    setStatusLog("[REGISTRO ARQUIVADO: DOCUMENTREFERENCE CLINICAL-PHOTO SALVO]");
  };

  const handleExecutarExclusao = (id: string) => {
    if (confirmInput.trim() !== "EXCLUIR") {
      setStatusLog("[ERRO DE CONFIRMAÇÃO: DIGITAÇÃO INEXATA]");
      return;
    }

    setFotos(fotos.filter((f) => f.id !== id));
    setDeleteId(null);
    setConfirmInput("");
    setStatusLog("[DOCUMENTREFERENCE PURGADO DO REPOSITÓRIO]");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="border-b-4 border-black pb-4">
        <span className="font-mono text-[10px] sm:text-xs uppercase font-bold text-[#1A4331] block">
          RECURSO OFICIAL: HL7 FHIR R4 // DOCUMENTREFERENCE
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black uppercase break-words">
          LINHA DO TEMPO CLÍNICA // REGISTRO VISUAL
        </h1>
        <p className="font-mono text-xs sm:text-sm uppercase text-black font-bold mt-1 break-words">
          MONITORAMENTO FOTOGRÁFICO DE RECONSTRUÇÃO MAMÁRIA, CICATRIZES E EDEMA LINFÁTICO
        </p>
      </section>

      {/* Status da Engine */}
      <div className="border-2 border-black bg-black text-[#F4F4EB] p-2.5 sm:p-3 font-mono text-xs sm:text-sm uppercase flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
        <span>STATUS DO STORAGE CRIPTOGRAFADO:</span>
        <span className="text-[#B8860B] font-bold break-words">{statusLog}</span>
      </div>

      {/* Formulário de Upload / Registro do DocumentReference */}
      <section className="border-2 border-black bg-[#F4F4EB] p-4 sm:p-5 space-y-4">
        <h2 className="font-serif text-lg sm:text-xl font-black uppercase border-b-2 border-black pb-2">
          ARQUIVAR NOVO REGISTRO VISUAL
        </h2>
        <form onSubmit={handleSalvarFoto} className="space-y-4">
          <div>
            <label htmlFor="url-attachment" className="block font-mono text-xs sm:text-sm font-bold uppercase mb-1">
              LOCALIZADOR DE OBJETO CRIPTOGRAFADO (S3/R2 URL OU PATH LOCAL):
            </label>
            <input
              id="url-attachment"
              type="text"
              value={novaUrl}
              onChange={(e) => setNovaUrl(e.target.value)}
              placeholder="HTTPS://ENCRYPTED-BUCKET.TRILHA.SAUDE.GOV.BR/PATIENT/REGISTRO.JPG"
              className="w-full min-h-[48px] px-3 border-2 border-black font-mono text-sm sm:text-base bg-white text-black focus:outline-none focus:bg-white"
              required
            />
          </div>
          <div>
            <label htmlFor="desc-attachment" className="block font-mono text-xs sm:text-sm font-bold uppercase mb-1">
              DESCRITIVO CLÍNICO E OBSERVAÇÕES MÉDICAS:
            </label>
            <input
              id="desc-attachment"
              type="text"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              placeholder="EX: MEDIÇÃO DE EDEMA NO ANTEBRAÇO ESQUERDO. PERÍMETRO: 24.5 CM."
              className="w-full min-h-[48px] px-3 border-2 border-black font-mono text-sm sm:text-base bg-white text-black focus:outline-none focus:bg-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-6 bg-[#1A4331] text-[#F4F4EB] font-mono text-sm sm:text-base font-black uppercase border-2 border-black hover:bg-black hover:text-[#F4F4EB] active:bg-[#F4F4EB] active:text-[#1A4331] transition-none text-center"
          >
            VINCULAR FOTO AO PRONTUÁRIO
          </button>
        </form>
      </section>

      {/* Lista de Registros Cronológicos */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-black uppercase border-b-2 border-black pb-2">
          REGISTROS VISUAIS VINCULADOS
        </h2>

        {fotos.length === 0 ? (
          <div className="border-4 border-black p-6 sm:p-8 bg-white text-center font-mono text-base sm:text-lg font-black uppercase">
            [NENHUM REGISTRO VISUAL ARQUIVADO NESTA COMPETÊNCIA]
          </div>
        ) : (
          fotos.map((item) => {
            const dataObj = new Date(item.created);
            const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <article
                key={item.id}
                className="border-2 border-black bg-white p-3.5 sm:p-5 space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-black pb-2 gap-2">
                  <div>
                    <span className="font-mono text-[10px] sm:text-xs font-bold uppercase block text-black/70">
                      IDENTIFICADOR: {item.id} // TIPO: {item.typeCode.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-black uppercase text-[#1A4331] break-words">
                      {item.description}
                    </h3>
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-black bg-black text-[#F4F4EB] px-2.5 py-1 self-start md:self-auto shrink-0">
                    DATA: {dataFormatada}
                  </div>
                </div>

                <div className="border-2 border-black p-2.5 sm:p-3 bg-[#F4F4EB] font-mono text-xs sm:text-sm break-all overflow-hidden">
                  <span className="font-bold block uppercase text-[10px] sm:text-xs mb-1">LOCALIZADOR ENCRIPTADO (URL):</span>
                  {item.contentAttachmentUrl}
                </div>

                {/* Exclusão Inline Estrita */}
                <div className="pt-2 border-t border-black">
                  {deleteId === item.id ? (
                    <div className="border-2 border-black bg-[#7C2D3A] text-[#F4F4EB] p-3 space-y-2">
                      <div className="font-mono text-xs sm:text-sm font-bold uppercase break-words">
                        ATENÇÃO: AÇÃO DESTRUTIVA IRREVERSÍVEL. DIGITE &ldquo;EXCLUIR&rdquo; PARA PURGAR A REFERÊNCIA:
                      </div>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center">
                        <input
                          type="text"
                          value={confirmInput}
                          onChange={(e) => setConfirmInput(e.target.value)}
                          placeholder="DIGITE EXCLUIR"
                          className="w-full sm:w-auto flex-1 min-h-[44px] sm:min-h-[48px] px-3 border-2 border-black font-mono text-sm sm:text-base uppercase bg-white text-black focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecutarExclusao(item.id)}
                          className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 sm:px-6 bg-black text-[#F4F4EB] font-mono text-xs sm:text-sm font-black uppercase border-2 border-[#F4F4EB] hover:bg-[#F4F4EB] hover:text-black transition-none text-center"
                        >
                          CONFIRMAR PURGAÇÃO
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteId(null);
                            setConfirmInput("");
                          }}
                          className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 bg-[#F4F4EB] text-black font-mono text-xs sm:text-sm font-bold uppercase border-2 border-black hover:bg-black hover:text-[#F4F4EB] transition-none text-center"
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
                          setDeleteId(item.id);
                          setConfirmInput("");
                        }}
                        className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-4 bg-transparent text-black font-mono text-xs sm:text-sm font-bold uppercase border-2 border-black hover:bg-[#7C2D3A] hover:text-[#F4F4EB] transition-none text-center"
                      >
                        EXCLUIR REFERÊNCIA DO PRONTUÁRIO
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
