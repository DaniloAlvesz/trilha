"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { emptyCare, readCare, STORAGE_KEY, type CareData } from "@/lib/care";
type Context = {
  data: CareData;
  update: (fn: (d: CareData) => CareData) => void;
  ready: boolean;
  message: string;
  notify: (message: string) => void;
  clear: () => void;
};
const CareContext = createContext<Context | null>(null);
export function CareProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CareData>(emptyCare);
  const [ready, setReady] = useState(false);
  const [message, notify] = useState("");
  const blockedStorage = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = readCare(raw);
      if (saved) setData(saved);
      else if (raw) {
        blockedStorage.current = true;
        notify(
          "Não foi possível ler os dados salvos. Evite salvar novos dados antes de verificar este navegador.",
        );
      }
    } catch {
      notify(
        "Este navegador não permite guardar dados. Você pode usar o app nesta aba.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || blockedStorage.current) return;
    try {
      if (data.remember)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      notify(
        "Não foi possível guardar os dados neste aparelho. Eles continuam nesta aba. Antes de fechar, salve seu resumo.",
      );
    }
  }, [data, ready]);
  useEffect(() => {
    document.documentElement.classList.toggle("large-text", data.largeText);
  }, [data.largeText]);
  const update = useCallback(
    (fn: (d: CareData) => CareData) => setData(fn),
    [],
  );
  return (
    <CareContext.Provider
      value={{
        data,
        update,
        ready,
        message,
        notify,
        clear: () => {
          try {
            localStorage.removeItem(STORAGE_KEY);
            blockedStorage.current = false;
            setData(emptyCare());
            notify("Registros apagados deste navegador.");
          } catch {
            notify(
              "O navegador não permitiu apagar os dados. Tente pelas configurações do navegador.",
            );
          }
        },
      }}
    >
      {children}
    </CareContext.Provider>
  );
}
export function useCare() {
  const ctx = useContext(CareContext);
  if (!ctx) throw new Error("CareProvider is required");
  return ctx;
}
