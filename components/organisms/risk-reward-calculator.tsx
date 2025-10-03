// components/organisms/risk-reward-calculator.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  calculateRiskReward,
  isValidRiskReward,
} from "@/lib/utils/calculations/risk-reward";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters/currency";
import type { RiskRewardCalculation } from "@/lib/types/trade";
import { draftStorage } from "@/lib/storage/draft-storage";

interface RiskRewardCalculatorProps {
  onComplete: (calculation: RiskRewardCalculation) => void;
  initialData?: Partial<RiskRewardCalculation>;
  onBack?: () => void;
}

export const RiskRewardCalculator = ({
  onComplete,
  initialData,
  onBack,
}: RiskRewardCalculatorProps) => {
  const [entryPrice, setEntryPrice] = useState(() => {
    if (initialData?.entryPrice) return initialData.entryPrice.toString();
    const draft = draftStorage.getDraft();
    return draft?.checklist?.riskReward?.entryPrice?.toString() || "";
  });

  const [stopLoss, setStopLoss] = useState(() => {
    if (initialData?.stopLoss) return initialData.stopLoss.toString();
    const draft = draftStorage.getDraft();
    return draft?.checklist?.riskReward?.stopLoss?.toString() || "";
  });

  const [targetPrice, setTargetPrice] = useState(() => {
    if (initialData?.targetPrice) return initialData.targetPrice.toString();
    const draft = draftStorage.getDraft();
    return draft?.checklist?.riskReward?.targetPrice?.toString() || "";
  });

  const [positionSize, setPositionSize] = useState(() => {
    if (initialData?.positionSize) return initialData.positionSize.toString();
    const draft = draftStorage.getDraft();
    return draft?.checklist?.riskReward?.positionSize?.toString() || "";
  });

  const [leverage, setLeverage] = useState(() => {
    if (initialData?.leverage) return initialData.leverage.toString();
    const draft = draftStorage.getDraft();
    return draft?.checklist?.riskReward?.leverage?.toString() || "1";
  });

  const [calculation, setCalculation] = useState<RiskRewardCalculation | null>(
    null
  );

  useEffect(() => {
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    const target = parseFloat(targetPrice);
    const size = parseFloat(positionSize);
    const lev = parseFloat(leverage);

    if (
      !isNaN(entry) &&
      !isNaN(stop) &&
      !isNaN(target) &&
      !isNaN(size) &&
      !isNaN(lev) &&
      size > 0 &&
      lev > 0
    ) {
      const result = calculateRiskReward(entry, stop, target, size, lev);
      setCalculation(result);

      const draft = draftStorage.getDraft();
      draftStorage.updateChecklistData({
        ...(draft?.checklist || {}),
        riskReward: result,
      });
    } else {
      setCalculation(null);
    }
  }, [entryPrice, stopLoss, targetPrice, positionSize, leverage]);

  const isValid = calculation !== null && isValidRiskReward(calculation);

  const handleSubmit = () => {
    if (calculation && isValid) {
      onComplete(calculation);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>원칙 2: 리스크-리워드 계산</CardTitle>
        <CardDescription>
          손절가와 목표가를 설정하고, 리스크 대비 수익이 충분한지 확인하세요
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entryPrice">진입가</Label>
            <Input
              id="entryPrice"
              type="number"
              placeholder="50000"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="positionSize">포지션 크기</Label>
            <Input
              id="positionSize"
              type="number"
              placeholder="0.1"
              value={positionSize}
              onChange={(e) => setPositionSize(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stopLoss">손절가</Label>
            <Input
              id="stopLoss"
              type="number"
              placeholder="48000"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetPrice">목표가</Label>
            <Input
              id="targetPrice"
              type="number"
              placeholder="55000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="leverage">레버리지</Label>
            <Input
              id="leverage"
              type="number"
              min="1"
              max="100"
              placeholder="1"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
            />
          </div>
        </div>

        {calculation && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">리스크 (손실)</div>
                <div className="font-mono font-bold text-red-600">
                  {formatCurrency(calculation.riskAmount)} (
                  {formatPercent(-calculation.riskPercent)})
                </div>
              </div>

              <div>
                <div className="text-muted-foreground">리워드 (수익)</div>
                <div className="font-mono font-bold text-green-600">
                  {formatCurrency(calculation.rewardAmount)} (
                  {formatPercent(calculation.rewardPercent)})
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground mb-1">
                리스크-리워드 비율
              </div>
              <div className="text-3xl font-bold">
                1 : {calculation.ratio.toFixed(2)}
              </div>
              {calculation.leverage > 1 && (
                <div className="text-sm text-muted-foreground mt-1">
                  레버리지 {calculation.leverage}x 적용됨
                </div>
              )}
            </div>
          </div>
        )}

        {calculation &&
          (isValid ? (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                리스크 대비 수익이 충분합니다! (1:{calculation.ratio.toFixed(2)}
                )
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                리스크가 너무 큽니다. 리스크-리워드 비율이 최소 1:1 이상이어야
                합니다.
                <br />
                현재: 1:{calculation.ratio.toFixed(2)}
              </AlertDescription>
            </Alert>
          ))}
        <div className="flex gap-2">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
              size="lg"
            >
              이전
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1"
            size="lg"
          >
            다음 단계
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
