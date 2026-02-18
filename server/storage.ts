
import { db } from "./db";
import { spins, type InsertSpin, type Spin } from "@shared/schema";
import { sql, eq } from "drizzle-orm";

export interface IStorage {
  createSpin(spin: InsertSpin): Promise<Spin>;
  getGlobalStats(): Promise<{
    totalSpins: number;
    totalWagered: number;
    totalLost: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async createSpin(spin: InsertSpin): Promise<Spin> {
    const [newSpin] = await db.insert(spins).values(spin).returning();
    return newSpin;
  }

  async getGlobalStats() {
    const result = await db.select({
      totalSpins: sql<number>`count(*)`,
      totalWagered: sql<number>`sum(${spins.betAmount})`,
      totalWon: sql<number>`sum(${spins.winAmount})`,
    }).from(spins);

    const stats = result[0];
    const wagered = Number(stats.totalWagered || 0);
    const won = Number(stats.totalWon || 0);

    return {
      totalSpins: Number(stats.totalSpins || 0),
      totalWagered: wagered,
      totalLost: wagered - won,
    };
  }
}

export const storage = new DatabaseStorage();
