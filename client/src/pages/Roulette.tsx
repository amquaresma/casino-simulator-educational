import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, History, Disc } from "lucide-react";
import { api } from "@shared/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function Roulette() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bet, setBet] = useState(10);
  const [betType, setBetType] = useState<"red" | "black" | "even" | "odd" | "number">("red");
  const [betValue, setBetValue] = useState("1");
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ number: number; color: string } | null>(null);
  const [history, setHistory] = useState<{ number: number; color: string }[]>([]);

  const playMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.roulette.play.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.stats.global.path] });
      animateRoulette(data.winningNumber, data.winningColor, data.isWin);
    }
  });

  const animateRoulette = (num: number, col: string, won: boolean) => {
    setIsSpinning(true);
    setResult(null);
    
    setTimeout(() => {
      setIsSpinning(false);
      setResult({ number: num, color: col });
      setHistory(prev => [{ number: num, color: col }, ...prev].slice(0, 10));
      
      if (won) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast({ title: "VITÓRIA!", description: `Número ${num} (${col === "red" ? "Vermelho" : col === "black" ? "Preto" : "Verde"})!`, className: "bg-green-600 text-white" });
      } else {
        toast({ title: "A CASA VENCEU", description: `Número ${num} (${col === "red" ? "Vermelho" : col === "black" ? "Preto" : "Verde"}).`, variant: "destructive" });
      }
    }, 2000);
  };

  const handlePlay = () => {
    if (isSpinning) return;
    playMutation.mutate({ betAmount: bet, betType, betValue: betType === "number" ? betValue : undefined });
  };

  return (
    <div className="p-6 lg:p-12 max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase flex items-center justify-center gap-3">
          <Disc className="text-primary animate-spin-slow" /> ROLETA
        </h1>
        <p className="text-zinc-500">Onde o zero sempre garante o lucro do cassino.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-zinc-950 border border-white/5 rounded-3xl p-12 relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]" />
          
          <AnimatePresence mode="wait">
            {isSpinning ? (
              <motion.div
                key="spinning"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 border-8 border-dashed border-primary rounded-full flex items-center justify-center"
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]" />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className={`w-48 h-48 rounded-full border-8 border-white/10 flex items-center justify-center text-8xl font-black shadow-2xl ${
                  result?.color === "red" ? "bg-red-600" : result?.color === "black" ? "bg-zinc-900" : result?.color === "green" ? "bg-green-600" : "bg-zinc-800"
                }`}>
                  {result?.number ?? "?"}
                </div>
                {result && (
                  <p className="mt-6 text-zinc-500 uppercase font-bold tracking-widest">
                    {result.color === "red" ? "Vermelho" : result.color === "black" ? "Preto" : "Verde"}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="bg-zinc-900 border-white/5 p-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 block">Tipo de Aposta</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={betType === "red" ? "default" : "outline"} className={betType === "red" ? "bg-red-600 hover:bg-red-700" : ""} onClick={() => setBetType("red")}>Vermelho</Button>
                  <Button variant={betType === "black" ? "default" : "outline"} className={betType === "black" ? "bg-zinc-900 hover:bg-black" : ""} onClick={() => setBetType("black")}>Preto</Button>
                  <Button variant={betType === "even" ? "default" : "outline"} onClick={() => setBetType("even")}>Par</Button>
                  <Button variant={betType === "odd" ? "default" : "outline"} onClick={() => setBetType("odd")}>Ímpar</Button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Aposta</label>
                <div className="flex gap-2">
                  {[10, 50, 100].map(amt => (
                    <Button key={amt} variant={bet === amt ? "default" : "outline"} size="sm" onClick={() => setBet(amt)} className="flex-1">{amt}</Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handlePlay} 
                disabled={isSpinning}
                className="w-full h-16 text-xl font-black uppercase tracking-widest bg-primary hover:bg-red-600 shadow-lg shadow-primary/20"
              >
                {isSpinning ? "GIRANDO..." : "APOSTAR"}
              </Button>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2">
                  <History className="w-3 h-3" /> Últimos Números
                </h4>
                <div className="flex flex-wrap gap-2">
                  {history.map((h, i) => (
                    <span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      h.color === "red" ? "bg-red-600 text-white border-red-500" : h.color === "black" ? "bg-zinc-900 text-white border-zinc-700" : "bg-green-600 text-white border-green-500"
                    }`}>
                      {h.number}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-12 bg-zinc-900/50 border-white/5 p-8">
        <div className="flex gap-6 items-start">
          <ShieldAlert className="text-primary w-12 h-12 shrink-0" />
          <div>
            <h3 className="text-white font-bold mb-2 uppercase tracking-tight text-xl">O Poder do Zero</h3>
            <p className="text-zinc-400 leading-relaxed">
              Na Roleta Europeia, existem 37 números (0 a 36). Se você aposta no Vermelho, você tem 18 chances de ganhar. Mas o cassino tem 19 chances (18 pretos + o 0 verde). Esse único número verde garante que, no volume, o cassino retenha <strong>2.7%</strong> de todo o dinheiro apostado na mesa.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
