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
      description: "Pós-cirúrgico baseline",
    },
    {
      resourceType: "DocumentReference",
      id: "doc-photo-002",
      subjectId: "pat-uuid-001",
      typeCode: "clinical-photo",
      contentAttachmentUrl: "https://encrypted-storage.trilha.saude.gov.br/pat-uuid-001/linfedema-mes3-2026-09.jpg",
      created: "2026-09-01T14:30:00-03:00",
      description: "Pós-drenagem linfática",
    },
    {
      resourceType: "DocumentReference",
      id: "doc-photo-003",
      subjectId: "pat-uuid-001",
      typeCode: "clinical-photo",
      contentAttachmentUrl: "https://encrypted-storage.trilha.saude.gov.br/pat-uuid-001/linfedema-mes2-2026-08.jpg",
      created: "2026-08-10T11:15:00-03:00",
      description: "Acompanhamento de cicatrização",
    },
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  const [novaTag, setNovaTag] = useState("Pós-drenagem");
  const [novaUrl, setNovaUrl] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [statusFeedback, setStatusFeedback] = useState("");

  const tagsPredefinidas = [
    "Pós-drenagem",
    "Cicatrização",
    "Simetria do braço",
    "Reconstrução mamária",
    "Monitoramento de edema",
  ];

  const handleSalvarFoto = (e: React.FormEvent) => {
    e.preventDefault();
    const tagFinal = novaTag.trim() || "Acompanhamento visual";

    const novoDoc: DocumentReferenceResource = {
      resourceType: "DocumentReference",
      id: `doc-photo-${Date.now()}`,
      subjectId: "pat-uuid-001",
      typeCode: "clinical-photo",
      contentAttachmentUrl: novaUrl.trim() || `photo-registro-${Date.now()}.jpg`,
      created: new Date().toISOString(),
      description: tagFinal,
    };

    setFotos([novoDoc, ...fotos]);
    setNovaUrl("");
    setModalAberto(false);
    setStatusFeedback("Foto registrada com carinho na sua evolução!");
  };

  const handleExecutarExclusao = (id: string) => {
    if (confirmInput.trim() !== "EXCLUIR") {
      setStatusFeedback("Digite EXCLUIR para confirmar a remoção");
      return;
    }

    setFotos(fotos.filter((f) => f.id !== id));
    setDeleteId(null);
    setConfirmInput("");
    setStatusFeedback("Registro removido da galeria");
  };

  return (
    <div className="space-y-6 relative">
      {/* Cabeçalho Acolhedor */}
      <section className="bg-clinical-paper border border-clinical-surface/40 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="font-sans text-xs sm:text-sm font-semibold text-clinical-action block">
              Sua evolução no seu tempo
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clinical-ink mt-0.5">
              Evolução e Linha do Tempo
            </h1>
            <p className="font-sans text-sm sm:text-base text-clinical-ink/80 mt-1 leading-relaxed">
              Acompanhe visualmente a recuperação das cicatrizes, o alívio do inchaço e a evolução do seu corpo com total sigilo.
            </p>
          </div>
          <div className="rounded-full bg-clinical-surface/20 text-clinical-ink px-3 py-1 text-xs font-semibold shrink-0">
            🔒 Confidencial
          </div>
        </div>
      </section>

      {statusFeedback && (
        <div className="p-3 rounded-2xl bg-clinical-success text-white font-sans text-xs sm:text-sm font-bold shadow-sm text-center">
          ✓ {statusFeedback}
        </div>
      )}

      {/* Galeria Visual em Grade (Cards em Miniatura sem ruído visual) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
            Registros Fotográficos ({fotos.length})
          </h2>
          <span className="text-xs font-sans text-clinical-ink/70">
            Toque no botão de câmera para novo registro
          </span>
        </div>

        {fotos.length === 0 ? (
          <div className="rounded-3xl border border-clinical-surface/30 p-8 sm:p-12 bg-white text-center font-sans text-sm sm:text-base text-clinical-ink/75 shadow-sm space-y-3">
            <span className="text-4xl block">🌸</span>
            <p className="font-serif text-lg font-bold text-clinical-ink">
              Nenhuma foto adicionada ainda
            </p>
            <p className="text-xs sm:text-sm text-clinical-ink/70 max-w-sm mx-auto">
              Quando desejar, toque no botão rosa com o ícone de câmera no canto inferior para registrar sua primeira foto.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fotos.map((item) => {
              const dataObj = new Date(item.created);
              const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              return (
                <article
                  key={item.id}
                  className="group rounded-3xl border border-clinical-surface/30 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Miniatura da Foto com Estética Acolhedora */}
                  <div className="relative bg-gradient-to-br from-clinical-paper via-pink-50/50 to-clinical-surface/20 p-6 flex flex-col items-center justify-center text-center min-h-[140px] border-b border-clinical-surface/20">
                    <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                      📸
                    </span>
                    <span className="text-[11px] font-sans font-semibold text-clinical-ink/70 mt-2">
                      Registro Seguro
                    </span>

                    {/* Data Legível Formatada */}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs font-mono text-[11px] font-bold text-clinical-ink px-2.5 py-0.5 rounded-full shadow-xs border border-clinical-surface/30">
                      {dataFormatada}
                    </span>
                  </div>

                  {/* Informações do Card em Miniatura */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Etiqueta Breve */}
                      <span className="inline-block rounded-full bg-clinical-surface/25 text-clinical-action px-3 py-1 font-sans text-xs font-bold">
                        {item.description}
                      </span>
                    </div>

                    {/* Exclusão Empática */}
                    <div className="pt-2 border-t border-clinical-surface/20">
                      {deleteId === item.id ? (
                        <div className="rounded-xl bg-clinical-alert text-white p-3 space-y-2 text-xs">
                          <p className="font-semibold">Digite EXCLUIR para confirmar:</p>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={confirmInput}
                              onChange={(e) => setConfirmInput(e.target.value)}
                              placeholder="EXCLUIR"
                              className="flex-1 min-h-[40px] px-2 rounded-lg text-xs bg-white text-clinical-ink uppercase font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => handleExecutarExclusao(item.id)}
                              className="min-h-[40px] px-3 rounded-lg bg-clinical-ink text-white font-bold text-xs"
                            >
                              OK
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteId(null);
                                setConfirmInput("");
                              }}
                              className="min-h-[40px] px-2 rounded-lg bg-white/20 text-white text-xs"
                            >
                              ✕
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
                            className="min-h-[48px] px-2 inline-flex items-center text-xs font-sans font-semibold text-clinical-ink/60 hover:text-clinical-alert transition-colors"
                          >
                            Excluir
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

      {/* FLOATING ACTION BUTTON (FAB) - CANTO INFERIOR DIREITO NA THUMB ZONE */}
      <div className="fixed bottom-24 right-4 sm:right-8 z-40">
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-clinical-action text-white shadow-xl hover:bg-clinical-ink transition-all flex items-center justify-center text-2xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-clinical-action/30"
          aria-label="Registrar nova foto"
          title="Tirar ou adicionar foto"
        >
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* MODAL ACOLHEDOR DE REGISTRO RÁPIDO */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-clinical-surface/20 pb-3">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-clinical-ink">
                  Novo Registro Fotográfico
                </h3>
                <p className="text-xs font-sans text-clinical-ink/70">
                  Adicione uma foto de acompanhamento à sua linha do tempo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="w-10 h-10 rounded-full bg-clinical-paper flex items-center justify-center text-clinical-ink hover:bg-clinical-surface/20 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarFoto} className="space-y-4">
              <div>
                <label className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-2">
                  Escolha uma etiqueta para esta foto:
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagsPredefinidas.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNovaTag(tag)}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-semibold border transition-all ${
                        novaTag === tag
                          ? "bg-clinical-action text-white border-clinical-action shadow-sm"
                          : "bg-clinical-paper text-clinical-ink border-clinical-surface/30 hover:border-clinical-action"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="modal-foto-url" className="block font-sans text-xs sm:text-sm font-bold text-clinical-ink mb-1">
                  Foto ou identificador do arquivo:
                </label>
                <input
                  id="modal-foto-url"
                  type="text"
                  value={novaUrl}
                  onChange={(e) => setNovaUrl(e.target.value)}
                  placeholder="Ex: foto-recuperacao-outubro.jpg ou link seguro..."
                  className="w-full min-h-[48px] px-3.5 rounded-xl border border-clinical-ink/20 font-sans text-sm bg-clinical-paper text-clinical-ink focus:outline-none focus:bg-white focus:ring-2 focus:ring-clinical-action/30"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  className="w-full sm:flex-1 min-h-[50px] rounded-2xl bg-clinical-action text-white font-sans text-sm font-bold hover:bg-clinical-action/90 transition-all shadow-sm active:scale-95"
                >
                  Salvar foto na evolução
                </button>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="w-full sm:w-auto min-h-[50px] px-5 rounded-2xl bg-clinical-paper text-clinical-ink font-sans text-sm font-semibold hover:bg-clinical-surface/30 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
