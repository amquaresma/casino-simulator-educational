import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Binary, Brain, Landmark, Coins, AlertCircle } from "lucide-react";

export default function Education() {
  return (
    <div className="p-6 lg:p-12 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">CENTRO EDUCATIVO</h1>
        <p className="text-zinc-400 text-lg">Aprenda a ciência por trás da sua perda em 4 etapas fundamentais.</p>
      </header>

      <Tabs defaultValue="rng" className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 h-auto bg-zinc-950 border border-white/5 p-1 mb-8">
          <TabsTrigger value="rng" className="data-[state=active]:bg-primary data-[state=active]:text-white py-3">1. O Coração</TabsTrigger>
          <TabsTrigger value="psych" className="data-[state=active]:bg-primary data-[state=active]:text-white py-3">2. A Ilusão</TabsTrigger>
          <TabsTrigger value="math" className="data-[state=active]:bg-primary data-[state=active]:text-white py-3">3. A Matemática</TabsTrigger>
          <TabsTrigger value="profit" className="data-[state=active]:bg-primary data-[state=active]:text-white py-3">4. O Lucro</TabsTrigger>
        </TabsList>

        <TabsContent value="rng">
          <EducationCard 
            icon={Binary}
            title="Etapa 1: O Coração do Algoritmo (RNG)"
            subtitle="Como o cassino decide quando você 'tem sorte'"
            content={
              <div className="space-y-4">
                <p>Todo jogo de cassino digital é movido por um <strong>Gerador de Números Aleatórios (RNG)</strong>. No entanto, em cassinos comerciais, eles usam o PRNG (Pseudo-RNG).</p>
                <p>O PRNG é um algoritmo determinístico: se você souber o estado inicial (seed), poderá prever todos os resultados. Os cassinos garantem que esses números sigam uma <strong>distribuição estatística específica</strong>.</p>
                <div className="bg-black/50 p-4 rounded-lg border border-primary/20">
                  <h4 className="text-primary font-bold mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> O Segredo:</h4>
                  <p className="text-sm">O RNG não é "justo", ele é "controlado". Ele é programado para que certas combinações (as que pagam muito) apareçam com uma frequência matematicamente impossível de gerar lucro para o jogador no longo prazo.</p>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="psych">
          <EducationCard 
            icon={Brain}
            title="Etapa 2: A Ilusão do Quase (Near-Miss)"
            subtitle="Como seu cérebro é enganado para continuar jogando"
            content={
              <div className="space-y-4">
                <p>Já notou que em máquinas de slots, o terceiro símbolo muitas vezes para logo acima ou abaixo da linha de vitória? Isso é o <strong>Near-Miss</strong>.</p>
                <p>Psicologicamente, seu cérebro processa o "quase ganhei" não como uma perda, mas como um <strong>sinal de que a vitória está próxima</strong>. Isso libera dopamina, a mesma substância de quando você realmente ganha.</p>
                <ul className="list-disc list-inside space-y-2 text-zinc-400">
                  <li>Sons festivos mesmo em perdas pequenas</li>
                  <li>Luzes e cores vibrantes que estimulam o vício</li>
                  <li>A sensação de controle (escolher quando parar no Crash)</li>
                </ul>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="math">
          <EducationCard 
            icon={Landmark}
            title="Etapa 3: A Matemática Implacável (House Edge)"
            subtitle="O lucro está embutido no código fonte"
            content={
              <div className="space-y-4">
                <p>A "Margem da Casa" é a diferença entre a probabilidade real de um evento e o que o cassino paga por ele.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-950 p-4 rounded border border-white/5">
                    <h5 className="text-white font-bold mb-1">RTP (Return to Player)</h5>
                    <p className="text-xs text-zinc-500">Se o RTP é 95%, o cassino <strong>garante</strong> 5% de lucro sobre cada real apostado por milhares de jogadores.</p>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded border border-white/5">
                    <h5 className="text-white font-bold mb-1">Crash Odds</h5>
                    <p className="text-xs text-zinc-500">No Crash, o multiplicador pode quebrar em 1.00x instantaneamente. Essa pequena chance garante que a casa nunca perca.</p>
                  </div>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="profit">
          <EducationCard 
            icon={Coins}
            title="Etapa 4: O Lucro do Dono"
            subtitle="Por que você conhece alguém que ganhou, mas o cassino continua rico"
            content={
              <div className="space-y-4">
                <p>Cassinos amam ganhadores individuais. Eles são o <strong>marketing gratuito</strong>. Quando alguém ganha o jackpot, isso reforça a ilusão de que é possível vencer.</p>
                <p>No entanto, o cassino olha para a <strong>Lei dos Grandes Números</strong>. Enquanto você olha para sua sessão de 10 minutos, o cassino olha para 10 milhões de giros por dia.</p>
                <p className="text-primary font-mono text-center p-6 border-y border-primary/10 italic">
                  "No volume, a sorte desaparece e a estatística se torna destino."
                </p>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EducationCard({ icon: Icon, title, subtitle, content }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-zinc-900 border-white/5 overflow-hidden">
        <CardHeader className="bg-zinc-950/50 p-8 border-b border-white/5">
          <div className="p-3 bg-primary/10 w-fit rounded-xl mb-4">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-white">{title}</CardTitle>
          <CardDescription className="text-zinc-500">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-zinc-300 leading-relaxed">
          {content}
        </CardContent>
      </Card>
    </motion.div>
  );
}
