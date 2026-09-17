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
      {/* Cabeçalho Acolhedor */}
      <section className="bg-clinical-paper border border-clinical-ink/20 rounded-2xl p-5 sm:p-6 shadow-sm">
        <span className="font-sans text-xs sm:text-sm font-semibold text-clinical-action block">
          Acompanhamento visual da sua recuperação
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clinical-ink mt-0.5">
          Linha do Tempo Visual
        </h1>
        <p className="font-sans text-sm sm:text-base text-clinical-ink/80 mt-1 leading-relaxed">
          Guarde fotos de acompanhamento das suas cicatrizes, da reconstrução mamária ou da simetria do seu braço. Acompanhar as mudanças mês a mês ajuda a valorizar cada etapa do processo de cicatrização.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-clinical-surface/20 text-clinical-ink px-3 py-1 text-xs font-medium border border-clinical-ink/15">
          <span>🔒</span> Suas fotos e anotações são confidenciais e protegidas com criptografia.
        </div>
      </section>

      {/* Formulário Acolhedor para Adicionar Nova Imagem */}
      <section className="rounded-2xl border border-clinical-ink/20 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
          Adicionar uma nova foto ou registro visual
        </h2>
        <form onSubmit={handleSalvarFoto} className="space-y-4">
          <div>
            <label htmlFor="url-attachment" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
              Endereço ou identificador da imagem:
            </label>
            <input
              id="url-attachment"
              type="text"
              value={novaUrl}
              onChange={(e) => setNovaUrl(e.target.value)}
              placeholder="Cole aqui o link seguro ou nome do arquivo da foto..."
              className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
              required
            />
          </div>
          <div>
            <label htmlFor="desc-attachment" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
              O que você gostaria de anotar sobre esta foto?
            </label>
            <input
              id="desc-attachment"
              type="text"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              placeholder="Ex: Medição do inchaço no antebraço após sessão de drenagem..."
              className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/30 font-sans text-sm sm:text-base bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-7 rounded-xl bg-clinical-action text-white font-sans text-sm sm:text-base font-bold hover:bg-clinical-ink transition-all shadow-sm text-center"
          >
            Salvar foto na minha linha do tempo
          </button>
        </form>
      </section>

      {/* Galeria Visual em Grade */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
          Sua galeria de evolução
        </h2>

        {fotos.length === 0 ? (
          <div className="rounded-2xl border border-clinical-ink/20 p-6 sm:p-8 bg-white text-center font-sans text-base font-medium text-clinical-ink/70 shadow-sm">
            Nenhuma foto adicionada ainda. Quando quiser, você pode registrar sua primeira imagem acima.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fotos.map((item) => {
              const dataObj = new Date(item.created);
              const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-clinical-ink/20 bg-white overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  {/* Container Visual da Foto (Placeholder Visual Elegante) */}
                  <div className="bg-clinical-paper border-b border-clinical-ink/15 p-8 flex flex-col items-center justify-center text-center space-y-2 min-h-[160px]">
                    <div className="w-14 h-14 rounded-full bg-clinical-surface/20 flex items-center justify-center text-2xl text-clinical-action">
                      📷
                    </div>
                    <span className="font-sans text-xs text-clinical-ink/60 font-semibold">
                      Registro fotográfico seguro
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-sans text-xs text-clinical-action font-semibold block">
                        {dataFormatada}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-clinical-ink mt-0.5 break-words">
                        {item.description}
                      </h3>
                    </div>

                    {/* Exclusão Inline Empática */}
                    <div className="pt-3 border-t border-clinical-ink/15">
                      {deleteId === item.id ? (
                        <div className="rounded-xl border border-clinical-alert/30 bg-clinical-alert text-white p-4 space-y-3 shadow-sm">
                          <div className="font-sans text-xs sm:text-sm font-semibold leading-relaxed">
                            Tem certeza que deseja apagar esta foto? Digite <strong>EXCLUIR</strong> para confirmar:
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
                              onClick={() => handleExecutarExclusao(item.id)}
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
                              setDeleteId(item.id);
                              setConfirmInput("");
                            }}
                            className="text-clinical-ink/70 hover:text-clinical-alert font-sans text-xs sm:text-sm font-semibold transition-all"
                          >
                            Excluir este registro
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
