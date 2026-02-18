import { GlobalStats } from "@/components/GlobalStats";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingDown, Users } from "lucide-react";

export default function Stats() {
  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter flex items-center gap-3">
          <BarChart3 className="text-primary w-8 h-8" /> PAINEL DE DADOS
        </h1>
        <p className="text-zinc-500 italic">A prova matemática do lucro da casa.</p>
      </header>

      <div className="mb-12">
        <GlobalStats />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-white/5 p-8">
          <TrendingDown className="w-12 h-12 text-primary mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">Por que os números não mentem?</h3>
          <p className="text-zinc-400 leading-relaxed">
            As estatísticas acima mostram o impacto real de milhares de simulações. A "Margem da Casa Real" (House Edge) é o quanto o algoritmo "roubou" efetivamente dos jogadores. Note que quanto mais giros ocorrem, mais esse número se estabiliza no lucro projetado.
          </p>
        </Card>

        <Card className="bg-zinc-900 border-white/5 p-8">
          <Users className="w-12 h-12 text-primary mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">O Coletivo vs O Individual</h3>
          <p className="text-zinc-400 leading-relaxed">
            Você pode ter sorte em 10 giros. Mas 1.000 jogadores fazendo 10 giros cada criam uma previsibilidade absoluta para o cassino. O sistema não é feito para ganhar de VOCÊ hoje, é feito para ganhar de TODOS para sempre.
          </p>
        </Card>
      </div>
    </div>
  );
}
