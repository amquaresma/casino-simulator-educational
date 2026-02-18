
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { randomUUID } from "crypto";

const SYMBOL_WEIGHTS = { "🍒": 40, "🍋": 30, "🍊": 20, "🍇": 15, "🔔": 10, "💎": 5, "7️⃣": 2 };
const PAYOUTS = { "🍒": 5, "🍋": 10, "🍊": 15, "🍇": 20, "🔔": 50, "💎": 100, "7️⃣": 500 };

function getRandomSymbol(): string {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    random -= weight;
    if (random <= 0) return symbol;
  }
  return "🍒";
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.post(api.slot.spin.path, async (req, res) => {
    const input = api.slot.spin.input.parse(req.body);
    const sessionId = input.sessionId || randomUUID();
    const symbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    let winAmount = 0;
    let isWin = false;
    let message = "A casa venceu novamente. Tente outra vez.";

    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      const multiplier = PAYOUTS[symbols[0] as keyof typeof PAYOUTS] || 0;
      winAmount = input.betAmount * multiplier;
      isWin = true;
      message = `JACKPOT! Você ganhou $${winAmount}!`;
    } else if (symbols[0] === "🍒" && symbols[1] === "🍒") {
      winAmount = input.betAmount * 2;
      isWin = true;
      message = "Cerejas! Um pequeno retorno.";
    }

    const spin = await storage.createSpin({
      sessionId,
      gameType: "slot",
      betAmount: input.betAmount,
      winAmount,
      resultData: { symbols },
      isWin,
    });

    res.json({ id: spin.id, symbols, winAmount, isWin, message });
  });

  app.post(api.crash.play.path, async (req, res) => {
    const input = api.crash.play.input.parse(req.body);
    const sessionId = input.sessionId || randomUUID();
    const crashPoint = Math.max(1, Math.floor((0.99 / (1 - Math.random())) * 100) / 100);
    let winAmount = 0;
    let isWin = false;
    let message = `O gráfico quebrou em ${crashPoint}x.`;

    if (crashPoint >= input.targetMultiplier) {
      winAmount = Math.floor(input.betAmount * input.targetMultiplier);
      isWin = true;
      message = `Sucesso! Você retirou em ${input.targetMultiplier}x antes do crash!`;
    }

    const spin = await storage.createSpin({
      sessionId,
      gameType: "crash",
      betAmount: input.betAmount,
      winAmount,
      resultData: { crashPoint, targetMultiplier: input.targetMultiplier },
      isWin,
    });

    res.json({ id: spin.id, crashPoint, winAmount, isWin, message });
  });

  app.post(api.coinflip.play.path, async (req, res) => {
    const input = api.coinflip.play.input.parse(req.body);
    const sessionId = input.sessionId || randomUUID();
    
    // 50/50 probability, but we simulate house edge by taking a 5% commission on wins (standard in many games)
    // or simply making the probability slightly unfair (47.5% win chance)
    const winChance = 0.475; 
    const isWin = Math.random() < winChance;
    const result = Math.random() < 0.5 ? "heads" : "tails";
    const actualResult = isWin ? input.choice : (input.choice === "heads" ? "tails" : "heads");
    
    let winAmount = 0;
    let message = `Caiu ${actualResult === "heads" ? "Cara" : "Coroa"}. Você perdeu.`;

    if (isWin) {
      winAmount = input.betAmount * 1.95; // 1.95x instead of 2x (5% house edge)
      message = `Caiu ${actualResult === "heads" ? "Cara" : "Coroa"}. Você ganhou $${winAmount}!`;
    }

    const spin = await storage.createSpin({
      sessionId,
      gameType: "coinflip",
      betAmount: input.betAmount,
      winAmount: Math.floor(winAmount),
      resultData: { result: actualResult, choice: input.choice },
      isWin,
    });

    res.json({ 
      id: spin.id, 
      result: actualResult, 
      winAmount: Math.floor(winAmount), 
      isWin, 
      message 
    });
  });

  app.post(api.roulette.play.path, async (req, res) => {
    const input = api.roulette.play.input.parse(req.body);
    const sessionId = input.sessionId || randomUUID();
    
    // Standard European Roulette: 0-36
    const winningNumber = Math.floor(Math.random() * 37);
    
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const winningColor = winningNumber === 0 ? "green" : (redNumbers.includes(winningNumber) ? "red" : "black");
    
    let isWin = false;
    let multiplier = 0;
    
    if (input.betType === "red") {
      isWin = winningColor === "red";
      multiplier = 2;
    } else if (input.betType === "black") {
      isWin = winningColor === "black";
      multiplier = 2;
    } else if (input.betType === "even") {
      isWin = winningNumber !== 0 && winningNumber % 2 === 0;
      multiplier = 2;
    } else if (input.betType === "odd") {
      isWin = winningNumber % 2 !== 0;
      multiplier = 2;
    } else if (input.betType === "number") {
      isWin = winningNumber === parseInt(input.betValue || "-1");
      multiplier = 36;
    }
    
    const winAmount = isWin ? input.betAmount * multiplier : 0;
    const message = isWin 
      ? `A bola parou no ${winningNumber} (${winningColor === "red" ? "Vermelho" : winningColor === "black" ? "Preto" : "Verde"}). Você ganhou $${winAmount}!`
      : `A bola parou no ${winningNumber} (${winningColor === "red" ? "Vermelho" : winningColor === "black" ? "Preto" : "Verde"}). A casa venceu.`;

    const spin = await storage.createSpin({
      sessionId,
      gameType: "roulette",
      betAmount: input.betAmount,
      winAmount,
      resultData: { winningNumber, winningColor, betType: input.betType, betValue: input.betValue },
      isWin,
    });

    res.json({ id: spin.id, winningNumber, winningColor, winAmount, isWin, message });
  });

  app.get(api.stats.global.path, async (req, res) => {
    const stats = await storage.getGlobalStats();
    const houseEdge = stats.totalWagered > 0 
      ? ((stats.totalLost / stats.totalWagered) * 100).toFixed(2) 
      : "0.00";
    res.json({ ...stats, houseEdge: `${houseEdge}%` });
  });

  return httpServer;
}
