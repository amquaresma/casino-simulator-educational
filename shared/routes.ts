import { z } from 'zod';
import { insertSpinSchema, spins } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  slot: {
    spin: {
      method: 'POST' as const,
      path: '/api/slot/spin',
      input: z.object({
        betAmount: z.number().min(1).max(1000),
        sessionId: z.string().uuid().optional(),
      }),
      responses: {
        200: z.object({
          id: z.number(),
          symbols: z.array(z.string()),
          winAmount: z.number(),
          isWin: z.boolean(),
          message: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  crash: {
    play: {
      method: 'POST' as const,
      path: '/api/crash/play',
      input: z.object({
        betAmount: z.number().min(1).max(1000),
        targetMultiplier: z.number().min(1.01).max(100),
        sessionId: z.string().uuid().optional(),
      }),
      responses: {
        200: z.object({
          id: z.number(),
          crashPoint: z.number(),
          winAmount: z.number(),
          isWin: z.boolean(),
          message: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  coinflip: {
    play: {
      method: 'POST' as const,
      path: '/api/coinflip/play',
      input: z.object({
        betAmount: z.number().min(1).max(1000),
        choice: z.enum(['heads', 'tails']),
        sessionId: z.string().uuid().optional(),
      }),
      responses: {
        200: z.object({
          id: z.number(),
          result: z.enum(['heads', 'tails']),
          winAmount: z.number(),
          isWin: z.boolean(),
          message: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  roulette: {
    play: {
      method: 'POST' as const,
      path: '/api/roulette/play',
      input: z.object({
        betAmount: z.number().min(1).max(1000),
        betType: z.enum(['red', 'black', 'even', 'odd', 'number']),
        betValue: z.string().optional(), // for 'number' betType
        sessionId: z.string().uuid().optional(),
      }),
      responses: {
        200: z.object({
          id: z.number(),
          winningNumber: z.number(),
          winningColor: z.enum(['red', 'black', 'green']),
          winAmount: z.number(),
          isWin: z.boolean(),
          message: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  stats: {
    global: {
      method: 'GET' as const,
      path: '/api/stats/global',
      responses: {
        200: z.object({
          totalSpins: z.number(),
          totalWagered: z.number(),
          totalLost: z.number(),
          houseEdge: z.string(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
