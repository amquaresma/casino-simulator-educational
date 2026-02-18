
import { db } from "./db";
import { spins } from "@shared/schema";
import { randomUUID } from "crypto";

// === SLOT CONFIG ===
const SYMBOL_WEIGHTS = {
  "🍒": 40, "🍋": 30, "🍊": 20, "🍇": 15, "🔔": 10, "💎": 5, "7️⃣": 2,
};
const PAYOUTS = {
  "🍒": 5, "🍋": 10, "🍊": 15, "🍇": 20, "🔔": 50, "💎": 100, "7️⃣": 500,
};

function getRandomSymbol(): string {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    random -= weight;
    if (random <= 0) return symbol;
  }
  return "🍒";
}

async function seed() {
  console.log("Seeding database with 500 spins...");
  
  const spinData: any[] = [];
  const sessionId = randomUUID(); // Simulate one big session or multiple
  
  for (let i = 0; i < 500; i++) {
    const betAmount = 10;
    const reels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    let winAmount = 0;
    let isWin = false;

    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      const multiplier = PAYOUTS[reels[0] as keyof typeof PAYOUTS] || 0;
      winAmount = betAmount * multiplier;
      isWin = true;
    } else if (reels[0] === "🍒" && reels[1] === "🍒") {
      winAmount = betAmount * 2;
      isWin = true;
    }

    spinData.push({
      sessionId,
      betAmount,
      winAmount,
      symbols: reels,
      isWin,
    });
  }

  // Batch insert
  await db.insert(spins).values(spinData);
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
