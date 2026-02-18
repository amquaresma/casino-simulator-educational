import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Home, Zap, GraduationCap, BarChart3, ShieldAlert, CircleDot, Disc } from "lucide-react";
import { Link, useLocation } from "wouter";

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Caça-Níqueis", url: "/slots", icon: Zap },
  { title: "Crash Game", url: "/crash", icon: Zap },
  { title: "Cara ou Coroa", url: "/coinflip", icon: CircleDot },
  { title: "Roleta", url: "/roulette", icon: Disc },
  { title: "Educação", url: "/educacao", icon: GraduationCap },
  { title: "Estatísticas", url: "/estatisticas", icon: BarChart3 },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-white/5 bg-zinc-950">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tighter leading-tight">BEHIND THE <span className="text-primary">ODDS</span></h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Educação Matemática</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 px-6 mb-2">Simuladores & Dados</SidebarGroupLabel>
          <SidebarMenu className="px-3">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location === item.url}
                  className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-white/5 transition-colors"
                >
                  <Link href={item.url} className="flex items-center gap-3 px-3 py-2 w-full">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
