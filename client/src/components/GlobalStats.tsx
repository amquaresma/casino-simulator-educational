import { useStats } from "@/hooks/use-slot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, DollarSign, TrendingDown, Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function GlobalStats() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return <GlobalStatsSkeleton />;
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <StatsCard 
        title="Giros Totais" 
        value={data.totalSpins.toLocaleString()} 
        icon={<Globe className="w-4 h-4 text-zinc-500" />}
        description="Simulações da comunidade"
      />
      <StatsCard 
        title="Total Apostado" 
        value={`$${data.totalWagered.toLocaleString()}`} 
        icon={<DollarSign className="w-4 h-4 text-zinc-500" />}
        description="Dinheiro fictício total"
      />
      <StatsCard 
        title="Perda Acumulada" 
        value={`$${data.totalLost.toLocaleString()}`} 
        icon={<TrendingDown className="w-4 h-4 text-primary" />}
        description="Lucro total da casa"
        highlight
      />
      <StatsCard 
        title="House Edge Real" 
        value={data.houseEdge} 
        icon={<Percent className="w-4 h-4 text-zinc-500" />}
        description="Vantagem matemática"
      />
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  description,
  highlight = false
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`border-white/5 bg-zinc-950/50 backdrop-blur-xl ${highlight ? 'border-primary/20 bg-primary/5' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-black font-mono tracking-tighter ${highlight ? 'text-primary' : 'text-white'}`}>
          {value}
        </div>
        <p className="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-tight">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function GlobalStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-white/5 bg-zinc-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-3 w-[80px] bg-zinc-900" />
            <Skeleton className="h-4 w-4 rounded-full bg-zinc-900" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px] mb-2 bg-zinc-900" />
            <Skeleton className="h-3 w-[120px] bg-zinc-900" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
