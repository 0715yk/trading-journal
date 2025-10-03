// lib/types/trade.ts

export const ACCOUNT_TYPES = ["scalp", "trend", "sniper"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const EMOTIONAL_STATES = [1, 2, 3, 4, 5] as const;
export type EmotionalState = (typeof EMOTIONAL_STATES)[number];

export type ReasonType = string;

export type TradeStatus = "open" | "closed";

export interface EntryReason {
  type: ReasonType;
  description: string;
}

export interface RiskRewardCalculation {
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  riskPercent: number;
  rewardPercent: number;
  ratio: number;
  positionSize: number;
  leverage: number;
  riskAmount: number;
  rewardAmount: number;
}

export interface Checklist {
  analysisTime: number;
  entryReasons: EntryReason[];
  riskReward: RiskRewardCalculation;
  microAnalysis: string;
  macroAnalysis: string;
  finalChecks: Record<string, string | number | boolean>;
}

export interface TradeEntry {
  symbol: string;
  accountType: AccountType;
  entryTime: string;
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  positionSize: number;
  leverage: number;
  additionalNotes?: string;
}

export interface TradeExit {
  exitTime: string;
  exitPrice: number;
  actualPnL: number;
  actualPnLPercent: number;
  exitReason: string;
  reviewNotes: string;
}

export interface Trade {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: TradeStatus;
  checklist: Checklist;
  certificationImage: string;
  entry: TradeEntry;
  exit: TradeExit | null;
}
