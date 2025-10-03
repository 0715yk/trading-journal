// lib/utils/calculations/risk-reward.ts

import { TRADING_RULES } from "@/lib/constants/trading-rules";
import type { RiskRewardCalculation } from "@/lib/types/trade";

export const calculateRiskReward = (
  entryPrice: number,
  stopLoss: number,
  targetPrice: number,
  positionSize: number,
  leverage: number = 1
): RiskRewardCalculation => {
  const baseRiskAmount = Math.abs(entryPrice - stopLoss) * positionSize;
  const baseRewardAmount = Math.abs(targetPrice - entryPrice) * positionSize;

  const riskAmount = baseRiskAmount * leverage;
  const rewardAmount = baseRewardAmount * leverage;

  const riskPercent = Math.abs(((stopLoss - entryPrice) / entryPrice) * 100);
  const rewardPercent = Math.abs(
    ((targetPrice - entryPrice) / entryPrice) * 100
  );

  const ratio = riskAmount === 0 ? 0 : rewardAmount / riskAmount;

  return {
    entryPrice,
    stopLoss,
    targetPrice,
    riskPercent,
    rewardPercent,
    ratio,
    positionSize,
    leverage,
    riskAmount,
    rewardAmount,
  };
};

export const isValidRiskReward = (
  calculation: RiskRewardCalculation
): boolean => {
  if (!isFinite(calculation.ratio) || calculation.ratio === 0) {
    return false;
  }
  return calculation.ratio >= TRADING_RULES.MIN_RISK_REWARD_RATIO;
};
