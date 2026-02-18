import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

const getSessionId = () => {
  let sessionId = localStorage.getItem("slot_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("slot_session_id", sessionId);
  }
  return sessionId;
};

export function useSpin() {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  return useMutation({
    mutationFn: async (betAmount: number) => {
      const payload = {
        betAmount,
        sessionId,
      };
      
      const res = await fetch(api.slot.spin.path, {
        method: api.slot.spin.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Falha ao girar");
      }

      return api.slot.spin.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.stats.global.path] });
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: [api.stats.global.path],
    queryFn: async () => {
      const res = await fetch(api.stats.global.path);
      if (!res.ok) throw new Error("Falha ao buscar estatísticas");
      return api.stats.global.responses[200].parse(await res.json());
    },
    refetchInterval: 5000,
  });
}
