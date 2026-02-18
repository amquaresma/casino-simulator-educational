import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Zap, TrendingUp, AlertTriangle, History } from "lucide-react";
import { api, buildUrl } from "@shared/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Crash() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bet, setBet] = useState(10);
  const [target, setTarget] = useState(2.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [status, setStatus] = useState<"idle" | "running" | "crashed" | "won">("idle");
  const [history, setHistory] = useState<number[]>([]);
  
  const timerRef = useRef<any>(null);

  const playMutation = useMutation({
    mutationFn: async (data: { betAmount: number; targetMultiplier: number }) => {
      const res = await fetch(api.crash.play.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.stats.global.path] });
      startAnimation(data.crashPoint, data.isWin);
    }
  });

  const startAnimation = (crashPoint: number, won: boolean) => {
    setIsPlaying(true);
    setStatus("running");
    let current = 1.0;
    
    timerRef.current = setInterval(() => {
      current += 0.01 + (current * 0.005); // Accel
      const formatted = Math.floor(current * 100) / 100;
      
      if (formatted >= target && won && status !== "won") {
        // We technically won at the target, but keep animation going to crash point
      }

      if (formatted >= crashPoint) {
        clearInterval(timerRef.current);
        setMultiplier(crashPoint);
        setStatus(won ? "won" : "crashed");
        setIsPlaying(false);
        setHistory(prev => [crashPoint, ...prev].slice(0, 10));
        
        if (won) {
          toast({ title: "VOCÊ GANHOU!", description: `Retirou em ${target}x. O crash foi em ${crashPoint}x.`, className: "bg-green-600 text-white" });
        } else {
          toast({ title: "CRASH!", description: `O gráfico quebrou em ${crashPoint}x. Você perdeu a aposta.`, variant: "destructive" });
        }
      } else {
        setMultiplier(formatted);
      }
    }, 50);
  };

  const handlePlay = () => {
    if (isPlaying) return;
    setMultiplier(1.0);
    playMutation.mutate({ betAmount: bet, targetMultiplier: target });
  };

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter flex items-center gap-3">
          <Zap className="text-primary w-8 h-8" /> CRASH SIMULATOR
        </h1>
        <p className="text-zinc-500 italic">O jogo onde você acha que tem o controle.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-zinc-950 border-white/5 overflow-hidden flex flex-col items-center justify-center min-h-[400px] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={status}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-8xl font-black tabular-nums tracking-tighter z-10 ${
                status === "crashed" ? "text-primary" : status === "won" ? "text-green-500" : "text-white"
              }`}
            >
              {multiplier.toFixed(2)}<span className="text-4xl">x</span>
            </motion.div>
          </AnimatePresence>

          {status === "crashed" && <div className="text-primary font-bold uppercase tracking-widest mt-4 z-10">BOOM!</div>}
          {status === "won" && <div className="text-green-500 font-bold uppercase tracking-widest mt-4 z-10">CASHED OUT!</div>}
        </Card>

        <Card className="bg-zinc-900 border-white/5 p-6 h-fit">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block tracking-widest">Quantia da Aposta</label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={bet} 
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="bg-black border-white/10 text-white h-12 pl-10"
                />
                <TrendingUp className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Alvo (Auto Stop)</label>
                <span className="text-primary font-mono font-bold">{target.toFixed(2)}x</span>
              </div>
              <Slider 
                value={[target]} 
                min={1.1} 
                max={10} 
                step={0.1} 
                onValueChange={([v]) => setTarget(v)}
                disabled={isPlaying}
              />
            </div>

            <Button 
              onClick={handlePlay} 
              disabled={isPlaying}
              className="w-full h-16 text-xl font-black uppercase tracking-widest bg-primary hover:bg-red-600 shadow-lg shadow-primary/20"
            >
              {isPlaying ? "SUBINDO..." : "APOSTAR"}
            </Button>

            <div className="pt-6 border-t border-white/5">
              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2">
                <History className="w-3 h-3" /> Histórico (Crash Points)
              </h4>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <span key={i} className={`px-2 py-1 rounded text-xs font-bold border ${h >= 2 ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-primary border-primary/20 bg-primary/5'}`}>
                    {h.toFixed(2)}x
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-12 bg-zinc-900/50 border-primary/20 p-6">
        <div className="flex gap-4">
          <AlertTriangle className="text-primary w-12 h-12 shrink-0" />
          <div>
            <h3 className="text-white font-bold mb-1 italic uppercase tracking-tighter underline">O "Pulo do Gato" Matemático</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              No Crash, a maioria dos usuários perde porque tenta buscar multiplicadores altos. O que o cassino não te conta é que a probabilidade de um crash acontecer <strong>imediatamente em 1.00x</strong> é suficiente para pagar todas as vitórias dos "sortudos". O algoritmo é projetado para que o valor médio de crash multiplicado pela probabilidade seja sempre menor que 1.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
