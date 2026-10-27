"use client";
import { useState } from "react";
import Link from "next/link";
import { useCare } from "@/components/CareProvider";
const needs = [
  "Conversar sobre minhas emoções",
  "Pedir ajuda para ir à consulta",
  "Conversar sobre sexualidade e meu corpo",
  "Entender melhor meu tratamento",
  "Conhecer apoio para homens com câncer de mama",
  "Pedir apoio para família, trabalho ou despesas",
];
export default function Support() {
  const { update, notify } = useCare();
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">APOIO TAMBÉM É CUIDADO</p>
          <h1>Você pode pedir apoio.</h1>
          <p>
            Não é preciso resolver tudo sem ajuda. Escolha o que faria diferença
            neste momento.
          </p>
        </div>
      </div>
      <section className="card form-stack">
        <h2>Quero conversar sobre…</h2>
        <div className="check-grid">
          {needs.map((n) => (
            <label className="check-label" key={n}>
              <input
                type="checkbox"
                checked={selected.includes(n)}
                onChange={() =>
                  setSelected((s) =>
                    s.includes(n) ? s.filter((v) => v !== n) : [...s, n],
                  )
                }
              />
              <span>{n}</span>
            </label>
          ))}
        </div>
        <button
          className="button"
          disabled={!selected.length}
          onClick={() => {
            update((d) => ({
              ...d,
              questions: [
                ...d.questions,
                ...selected
                  .filter((n) => !d.questions.some((q) => q.text === n))
                  .map((text) => ({ id: crypto.randomUUID(), text })),
              ],
            }));
            setSelected([]);
            notify("Temas adicionados às suas dúvidas para a consulta.");
          }}
        >
          Levar estes temas para a consulta
        </button>
        <Link href="/relatorio-print">Ver minhas dúvidas guardadas</Link>
      </section>
      <section className="card">
        <h2>Onde procurar apoio</h2>
        <p>
          Seu serviço de saúde pode informar sobre psicologia, serviço social,
          reabilitação e grupos de apoio disponíveis na sua região. Pergunte
          quais opções atendem suas necessidades.
        </p>
        <p>
          Para conversar com um serviço de apoio emocional, conheça o{" "}
          <a href="https://cvv.org.br/">CVV</a> ou ligue{" "}
          <a href="tel:188">188</a>. Em uma emergência, ligue{" "}
          <a href="tel:192">192</a>.
        </p>
      </section>
      <section className="info-note">
        <h2>Sobre a comunidade do protótipo</h2>
        <p>
          Não há uma sala de conversa ativa nesta versão. As publicações
          simuladas foram retiradas para não parecerem relatos reais. Uma
          comunidade futura precisa de moderação, denúncia, bloqueio e regras de
          proteção antes de receber participantes.
        </p>
      </section>
    </div>
  );
}
