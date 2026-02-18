import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpin } from "@/hooks/use-slot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, AlertTriangle, TrendingDown, Coins } from "lucide-react";
import confetti from "canvas-confetti";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "🔔", "💎", "7️⃣"];

interface ChartData {
  spin: number;
  balance: number;
}

export function SlotMachine() {
  const { mutate: spin, isPending } = useSpin();
  const { toast } = useToast();
  
  const [reels, setReels] = useState<string[]>(["7️⃣", "7️⃣", "7️⃣"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [lastWin, setLastWin] = useState(0);
  const [message, setMessage] = useState("CLIQUE EM GIRAR PARA COMEÇAR");
  const [history, setHistory] = useState<ChartData[]>([{ spin: 0, balance: 1000 }]);
  const spinCount = useRef(0);

  const handleSpin = () => {
    if (balance < bet) {
      toast({
        title: "Saldo Insuficiente",
        description: "Por favor, reinicie a simulação para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    setMessage("GIRANDO...");
    setBalance(prev => prev - bet);

    spin(bet, {
      onSuccess: (data) => {
        setTimeout(() => {
          setReels(data.symbols);
          const newBalance = balance - bet + data.winAmount;
          setBalance(newBalance);
          setLastWin(data.winAmount);
          setIsSpinning(false);
          setMessage(data.message);
          
          spinCount.current += 1;
          setHistory(prev => [...prev, { spin: spinCount.current, balance: newBalance }]);

          if (data.isWin) {
            triggerWinEffect();
            if (data.winAmount > bet * 5) {
               toast({
                title: "GRANDE VITÓRIA!",
                description: `Você ganhou $${data.winAmount}!`,
                className: "bg-primary border-primary text-white",
              });
            }
          }

          if (spinCount.current % 10 === 0) {
            toast({
              title: "Checagem de Realidade",
              description: `Após ${spinCount.current} giros, veja a tendência do seu saldo. Está subindo ou descendo?`,
              duration: 5000,
            });
          }
        }, 1200);
      },
      onError: (error) => {
        setIsSpinning(false);
        setBalance(prev => prev + bet);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const triggerWinEffect = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#ffffff', '#000000']
    });
  };

  const resetGame = () => {
    setBalance(1000);
    setHistory([{ spin: 0, balance: 1000 }]);
    spinCount.current = 0;
    setLastWin(0);
    setMessage("SIMULAÇÃO REINICIADA");
    toast({ description: "Saldo resetado para $1000" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="relative bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-8 bg-black/50 p-4 rounded-xl border border-white/5">
             <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Último Ganho</p>
              <p className="text-2xl font-mono text-primary font-bold">
                ${lastWin}
              </p>
            </div>
            <div className="text-center px-4 border-x border-white/10 flex-1 mx-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Status</p>
              <p className="text-xs font-mono text-white/90 truncate uppercase">{message}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Seu Saldo</p>
              <p className="text-2xl font-mono text-white font-bold">
                ${balance}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {reels.map((symbol, i) => (
              <Reel key={i} symbol={symbol} isSpinning={isSpinning} delay={i * 0.1} />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setBet(Math.max(10, bet - 10))}
                disabled={isSpinning || bet <= 10}
                className="text-white hover:text-primary hover:bg-white/5"
              >
                -
              </Button>
              <div className="text-center">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-widest">Aposta</span>
                <span className="text-xl font-mono font-bold text-white">${bet}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setBet(Math.min(100, bet + 10))}
                disabled={isSpinning || bet >= 100}
                className="text-white hover:text-primary hover:bg-white/5"
              >
                +
              </Button>
            </div>

            <Button
              onClick={handleSpin}
              disabled={isSpinning || balance < bet}
              className="w-full py-8 text-2xl font-black uppercase tracking-widest bg-primary hover:bg-red-600 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              {isSpinning ? "GIRANDO..." : "GIRAR AGORA"}
            </Button>
            
            <div className="flex justify-center mt-2">
              <Button 
                variant="ghost" 
                onClick={resetGame}
                disabled={isSpinning}
                className="text-xs text-zinc-500 hover:text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> Reiniciar Simulação
              </Button>
            </div>
          </div>
        </div>
        
        <Card className="bg-zinc-900/50 border-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold mb-1 uppercase tracking-tighter italic">Realidade Matemática</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Esta máquina possui um RTP (Retorno ao Jogador) de 95%. Isso significa que, estatisticamente, a cada $100 apostados, a casa mantém $5. Vitórias individuais acontecem para manter você jogando, mas o sistema é imparcial.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card className="bg-zinc-950 border border-white/5 p-6 shadow-xl h-full flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase flex items-center gap-2">
              <TrendingDown className="text-primary w-5 h-5" /> Fluxo de Saldo
            </h3>
            <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400 font-mono font-bold tracking-widest">
              LIVE DATA
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="spin" 
                  stroke="#444" 
                  tick={{fill: '#444', fontSize: 10}}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#444" 
                  tick={{fill: '#444', fontSize: 10}}
                  domain={[0, 'auto']}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderRadius: '8px', border: '1px solid #222' }}
                  labelStyle={{ color: '#666', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
               <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total de Giros</span>
               <p className="text-xl font-mono text-white font-bold">{spinCount.current}</p>
             </div>
             <div className={`p-4 rounded-xl border ${balance >= 1000 ? 'bg-green-500/5 border-green-500/20' : 'bg-primary/5 border-primary/20'}`}>
               <span className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Lucro Líquido</span>
               <p className={`text-xl font-mono font-bold ${balance >= 1000 ? 'text-green-500' : 'text-primary'}`}>
                 {balance - 1000 > 0 ? '+' : ''}{balance - 1000}
               </p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Reel({ symbol, isSpinning, delay }: { symbol: string; isSpinning: boolean; delay: number }) {
  return (
    <div className="w-24 h-32 bg-zinc-950 rounded-2xl border-2 border-white/5 shadow-inner flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none z-10" />
      <AnimatePresence mode="popLayout">
        {isSpinning ? (
          <motion.div
            key="spinning"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 100, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.1, 
              ease: "linear",
              delay: delay 
            }}
            className="text-5xl absolute"
          >
            {SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]}
          </motion.div>
        ) : (
          <motion.div
            key="stopped"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-6xl"
          >
            {symbol}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
