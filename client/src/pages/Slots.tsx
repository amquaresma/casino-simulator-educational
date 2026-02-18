import { SlotMachine } from "@/components/SlotMachine";
import { ShieldAlert, Zap } from "lucide-react";

export default function Slots() {
  return (
    <div className="p-6 lg:p-12">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
          <ShieldAlert className="w-3 h-3" /> Simulador de Probabilidade
        </div>
        <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tighter">CAÇA-NÍQUEIS</h1>
        <p className="text-zinc-500 max-w-xl mx-auto">
          Este simulador utiliza um algoritmo de RTP de 95%. Observe como, apesar de vitórias ocasionais, seu saldo tende ao zero no longo prazo.
        </p>
      </header>

      <SlotMachine />
    </div>
  );
}
