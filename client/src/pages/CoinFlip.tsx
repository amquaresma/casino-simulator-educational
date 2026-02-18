import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CircleDot, ShieldAlert, History, Coins } from "lucide-react";
import { api } from "@shared/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";

export default function CoinFlip() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const playMutation = useMutation({
    mutationFn: async (data: { betAmount: number; choice: "heads" | "tails" }) => {
      const res = await fetch(api.coinflip.play.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.stats.global.path] });
      animateFlip(data.result, data.isWin);
    }
  });

  const animateFlip = (finalResult: "heads" | "tails", won: boolean) => {
    setIsFlipping(true);
    setResult(null);
    
    setTimeout(() => {
      setIsFlipping(false);
      setResult(finalResult);
      setHistory(prev => [finalResult, ...prev].slice(0, 10));
      
      if (won) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast({ title: "VITÓRIA!", description: `Caiu ${finalResult === "heads" ? "Cara" : "Coroa"}!`, className: "bg-green-600 text-white" });
      } else {
        toast({ title: "PERDEU", description: `Caiu ${finalResult === "heads" ? "Cara" : "Coroa"}.`, variant: "destructive" });
      }
    }, 1500);
  };

  const handleFlip = () => {
    if (isFlipping) return;
    playMutation.mutate({ betAmount: bet, choice });
  };

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Cara ou Coroa</h1>
        <p className="text-zinc-500">O jogo mais simples, com a mesma margem implacável.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-8">
            <motion.div
              animate={isFlipping ? { rotateY: 1800 } : { rotateY: result === "tails" ? 180 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full h-full relative"
            >
              {/* Heads Side */}
              <div className="absolute inset-0 w-full h-full rounded-full bg-yellow-500 border-8 border-yellow-600 flex items-center justify-center text-4xl font-black text-yellow-900 backface-hidden shadow-2xl">
                CARA
              </div>
              {/* Tails Side */}
              <div className="absolute inset-0 w-full h-full rounded-full bg-zinc-500 border-8 border-zinc-600 flex items-center justify-center text-4xl font-black text-zinc-900 backface-hidden shadow-2xl" style={{ transform: "rotateY(180deg)" }}>
                COROA
              </div>
            </motion.div>
          </div>
          
          <div className="flex gap-4 w-full max-w-xs">
            <Button 
              variant={choice === "heads" ? "default" : "outline"} 
              className={`flex-1 h-14 font-bold ${choice === "heads" ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
              onClick={() => setChoice("heads")}
              disabled={isFlipping}
            >
              CARA
            </Button>
            <Button 
              variant={choice === "tails" ? "default" : "outline"} 
              className={`flex-1 h-14 font-bold ${choice === "tails" ? "bg-zinc-600 hover:bg-zinc-700" : ""}`}
              onClick={() => setChoice("tails")}
              disabled={isFlipping}
            >
              COROA
            </Button>
          </div>
        </div>

        <Card className="bg-zinc-900 border-white/5 p-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Aposta</label>
              <div className="flex gap-2">
                {[10, 50, 100].map(amt => (
                  <Button key={amt} variant={bet === amt ? "default" : "outline"} size="sm" onClick={() => setBet(amt)} className="flex-1">{amt}</Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleFlip} 
              disabled={isFlipping}
              className="w-full h-16 text-xl font-black uppercase tracking-widest bg-primary hover:bg-red-600"
            >
              {isFlipping ? "MOEDA NO AR..." : "LANÇAR MOEDA"}
            </Button>

            <div className="pt-6 border-t border-white/5">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2">
                <History className="w-3 h-3" /> Resultados Recentes
              </h4>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <span key={i} className={`px-2 py-1 rounded text-[10px] font-bold border ${h === "heads" ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 'text-zinc-400 border-zinc-500/20 bg-zinc-500/5'}`}>
                    {h === "heads" ? "CARA" : "COROA"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-12 bg-zinc-900/50 border-white/5 p-6">
        <div className="flex gap-4 items-start">
          <ShieldAlert className="text-primary w-10 h-10 shrink-0" />
          <div>
            <h3 className="text-white font-bold mb-1 uppercase tracking-tight">O "Justo" 50/50?</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Mesmo em um jogo de cara ou coroa, os cassinos aplicam uma margem. Nesta simulação, sua chance de vitória é de <strong>47.5%</strong> (em vez de 50%) e o pagamento é de <strong>1.95x</strong> (em vez de 2x). No longo prazo, essa pequena diferença drena seu saldo de forma invisível.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
