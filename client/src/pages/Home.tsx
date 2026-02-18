import { motion } from "framer-motion";
import { ShieldAlert, ChevronRight, Zap, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 text-center lg:p-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-8">
          <ShieldAlert className="w-4 h-4" /> Simulação Educativa de Cassino
        </div>
        
        <h1 className="text-5xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
          ENTENDA POR QUE A <span className="text-primary">CASA SEMPRE GANHA</span>
        </h1>
        
        <p className="text-xl lg:text-2xl text-zinc-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          O cassino não precisa de sorte. Eles têm a <span className="text-white font-medium italic underline decoration-primary">matemática</span> ao lado deles. Explore nossos simuladores e veja o algoritmo em ação.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-red-600 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-primary/20">
            <Link href="/slots">Simular Caça-Níqueis</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-bold h-14 px-8 rounded-xl">
            <Link href="/educacao">Aprender os Algoritmos</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 relative z-10 w-full max-w-5xl">
        {[
          { icon: Zap, title: "Algoritmos Reais", desc: "Simulações baseadas em RNG e distribuições de Crash reais." },
          { icon: Target, title: "Dados Visuais", desc: "Gráficos em tempo real que expõem a tendência de perda." },
          { icon: BookOpen, title: "Psicologia", desc: "Aprenda como o design dos jogos manipula seu cérebro." }
        ].map((feat, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl backdrop-blur-sm text-left hover:border-primary/20 transition-colors">
            <feat.icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">{feat.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
