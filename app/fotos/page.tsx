"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useCare } from "@/components/CareProvider";
import { dateLabel } from "@/lib/care";
export default function Photos() {
  const { data, update, notify } = useCare();
  const [caption, setCaption] = useState("");
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [remove, setRemove] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function select(file?: File) {
    setPending("");
    setError("");
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 1000000
    ) {
      setError("Escolha uma imagem JPG, PNG ou WebP com até 1 MB.");
      if (input.current) input.current.value = "";
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas
        .getContext("2d")!
        .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      setPending(canvas.toDataURL("image/jpeg", 0.8));
    } catch {
      setError("Não foi possível abrir esta imagem. Tente outra foto.");
    }
  }
  return (
    <div className="page-stack">
      <Link className="back-link" href="/ajuda">
        ← Voltar para Mais
      </Link>
      <div className="page-heading">
        <div>
          <h1>Meus registros em fotos</h1>
          <p>
            Guarde imagens somente se isso fizer sentido para você e para seu
            acompanhamento.
          </p>
        </div>
      </div>
      <p className="safety-note">
        O aplicativo não interpreta imagens nem avalia cicatrização. Fotos não
        são enviadas à equipe de saúde. Em caso de preocupação com seu corpo,
        procure seu serviço.
      </p>
      <form
        className="card form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending || !consent) return;
          if (data.photos.length >= 3) {
            setError(
              "O limite deste protótipo é de 3 fotos. Exclua uma foto para adicionar outra.",
            );
            return;
          }
          update((d) => ({
            ...d,
            photos: [
              {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                caption: caption.trim(),
                image: pending,
              },
              ...d.photos,
            ],
          }));
          setPending("");
          setCaption("");
          setConsent(false);
          if (input.current) input.current.value = "";
          notify("Foto adicionada neste navegador.");
        }}
      >
        <h2>Adicionar uma foto</h2>
        <p>
          Evite incluir rosto, documentos ou outras pessoas. Este protótipo
          aceita até 3 imagens e não tem proteção própria por senha.
        </p>
        <label className="check-label">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            Entendo que a foto ficará nesta aba
            {data.remember ? " e será guardada neste navegador" : ""}, com
            acesso para quem usar este aparelho.
          </span>
        </label>
        <div>
          <label htmlFor="photo-file">Escolher foto (até 1 MB)</label>
          <input
            id="photo-file"
            type="file"
            ref={input}
            accept="image/jpeg,image/png,image/webp"
            disabled={!consent}
            onChange={(e) => select(e.target.files?.[0])}
          />
        </div>
        {pending && (
          <img
            src={pending}
            alt="Prévia da foto escolhida, ainda não salva"
            style={{ maxHeight: 260, objectFit: "contain" }}
          />
        )}
        <div>
          <label htmlFor="photo-caption">
            O que deseja lembrar? (opcional)
          </label>
          <input
            id="photo-caption"
            maxLength={200}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button" disabled={!pending || !consent}>
          Salvar foto
        </button>
      </form>
      <section className="card">
        <h2>Minhas fotos ({data.photos.length}/3)</h2>
        {!data.photos.length && (
          <p>
            Nenhuma foto adicionada. Você pode usar todas as outras funções sem
            fotografar seu corpo.
          </p>
        )}
        <div className="photo-grid" style={{ marginTop: 20 }}>
          {data.photos.map((p) => (
            <figure key={p.id}>
              <img
                src={p.image}
                alt={p.caption || "Foto pessoal de acompanhamento"}
              />
              <figcaption>
                <strong>{dateLabel(p.date, true)}</strong>
                <p>{p.caption}</p>
              </figcaption>
              {remove !== p.id ? (
                <button className="text-button" onClick={() => setRemove(p.id)}>
                  Excluir foto de {dateLabel(p.date, true)}
                </button>
              ) : (
                <div className="actions">
                  <button
                    className="button danger"
                    onClick={() => {
                      update((d) => ({
                        ...d,
                        photos: d.photos.filter((x) => x.id !== p.id),
                      }));
                      setRemove("");
                      notify("Foto excluída do ONCO+.");
                    }}
                  >
                    Confirmar exclusão
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => setRemove("")}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
