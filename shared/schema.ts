
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const spins = pgTable("spins", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  gameType: text("game_type").notNull().default("slot"), // 'slot' or 'crash'
  betAmount: integer("bet_amount").notNull(),
  winAmount: integer("win_amount").notNull(),
  resultData: jsonb("result_data").notNull().default("{}"), // Stores game-specific results
  isWin: boolean("is_win").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSpinSchema = createInsertSchema(spins).omit({ id: true, createdAt: true });

export type Spin = typeof spins.$inferSelect;
export type InsertSpin = z.infer<typeof insertSpinSchema>;

export type GameStatsResponse = {
  totalSpins: number;
  totalWagered: number;
  totalLost: number;
  houseEdge: string;
};
