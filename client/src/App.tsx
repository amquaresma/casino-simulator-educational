import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Home from "@/pages/Home";
import Slots from "@/pages/Slots";
import Crash from "@/pages/Crash";
import CoinFlip from "@/pages/CoinFlip";
import Roulette from "@/pages/Roulette";
import Education from "@/pages/Education";
import Stats from "@/pages/Stats";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/slots" component={Slots} />
      <Route path="/crash" component={Crash} />
      <Route path="/coinflip" component={CoinFlip} />
      <Route path="/roulette" component={Roulette} />
      <Route path="/educacao" component={Education} />
      <Route path="/estatisticas" component={Stats} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-screen w-full bg-background">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-white/5 flex items-center lg:hidden">
                <SidebarTrigger />
                <span className="ml-4 font-bold text-primary tracking-tighter">BEHIND THE ODDS</span>
              </div>
              <Router />
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
