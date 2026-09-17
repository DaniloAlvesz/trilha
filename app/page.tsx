"use client";

import React, { useEffect } from "react";
import PainelHoje from "@/components/Hoje";

export default function PaginaInicial() {
  useEffect(() => {
    // Aplica o fundo aquarela fixo no body enquanto a usuária estiver na tela inicial
    document.body.classList.add("global-layout-background");
    return () => {
      document.body.classList.remove("global-layout-background");
    };
  }, []);

  return (
    <div className="global-layout-background -m-3 sm:-m-4 md:-m-6 p-3 sm:p-4 md:p-6 min-h-screen rounded-3xl">
      <PainelHoje />
    </div>
  );
}

