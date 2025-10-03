// app/trade/[id]/exit/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, TrendingUp, TrendingDown } from "lucide-react";
import type { Trade, TradeExit } from "@/lib/types/trade";
import { tradesApi } from "@/lib/supabase/api";

interface ExitPageProps {
  params: Promise<{ id: string }>;
}

export default function ExitPage({ params }: ExitPageProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [tradeId, setTradeId] = useState<string>("");
  const [exitData, setExitData] = useState<Partial<TradeExit>>({});
  const [calculatedPnL, setCalculatedPnL] = useState<{
    amount: number;
    percent: number;
  } | null>(null);

  const loadTrade = useCallback(
    async (id: string) => {
      try {
        const foundTrade = await tradesApi.getById(id);

        if (!foundTrade) {
          router.push("/");
          return;
        }

        if (foundTrade.status === "closed") {
          router.push(`/trade/${id}`);
          return;
        }

        setTrade(foundTrade);
      } catch (error) {
        console.error("Failed to load trade:", error);
        router.push("/");
      }
    },
    [router]
  );

  // useEffect 수정
  useEffect(() => {
    setIsMounted(true);

    params.then(({ id }) => {
      setTradeId(id);
      loadTrade(id);
    });
  }, [params, router, loadTrade]);

  // handleSubmit 수정
  const handleSubmit = async () => {
    if (
      !trade ||
      !calculatedPnL ||
      !exitData.exitPrice ||
      !exitData.exitReason ||
      !exitData.reviewNotes
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    try {
      const completeExit: TradeExit = {
        exitTime: new Date().toISOString(),
        exitPrice: Number(exitData.exitPrice),
        actualPnL: calculatedPnL.amount,
        actualPnLPercent: calculatedPnL.percent,
        exitReason: exitData.exitReason,
        reviewNotes: exitData.reviewNotes,
      };

      await tradesApi.update(tradeId, {
        status: "closed",
        exit: completeExit,
      });

      router.push(`/trade/${tradeId}`);
    } catch (error) {
      console.error("Failed to update trade:", error);
      alert("청산 정보 저장 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (trade && exitData.exitPrice) {
      const exitPrice = Number(exitData.exitPrice);
      const entryPrice = trade.entry.entryPrice;
      const positionSize = trade.entry.positionSize;
      const leverage = trade.entry.leverage;

      const priceDiff = exitPrice - entryPrice;
      const pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
      const pnlAmount = priceDiff * positionSize * leverage;

      setCalculatedPnL({
        amount: pnlAmount,
        percent: pnlPercent,
      });
    } else {
      setCalculatedPnL(null);
    }
  }, [exitData.exitPrice, trade]);

  const handleInputChange = (
    field: keyof TradeExit,
    value: string | number
  ) => {
    setExitData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isMounted || !trade) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  const isProfitEstimate = calculatedPnL && calculatedPnL.amount >= 0;

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>청산 정보 입력</CardTitle>
            <CardDescription>
              {trade.entry.symbol} · 진입가:{" "}
              {trade.entry.entryPrice.toLocaleString()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 청산가 */}
            <div className="space-y-2">
              <Label htmlFor="exitPrice">청산가 *</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.01"
                placeholder="예: 44200.00"
                value={exitData.exitPrice || ""}
                onChange={(e) => handleInputChange("exitPrice", e.target.value)}
              />
            </div>

            {/* 예상 손익 표시 */}
            {calculatedPnL && (
              <Alert
                className={
                  isProfitEstimate
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }
              >
                <div className="flex items-center gap-2">
                  {isProfitEstimate ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription
                    className={
                      isProfitEstimate ? "text-green-800" : "text-red-800"
                    }
                  >
                    <div className="font-semibold text-lg">
                      예상 손익: {isProfitEstimate ? "+" : ""}
                      {calculatedPnL.amount.toLocaleString()}(
                      {isProfitEstimate ? "+" : ""}
                      {calculatedPnL.percent.toFixed(2)}%)
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* 청산 사유 */}
            <div className="space-y-2">
              <Label htmlFor="exitReason">청산 사유 *</Label>
              <Input
                id="exitReason"
                placeholder="예: 목표가 도달, 손절 실행, 추세 전환 등"
                value={exitData.exitReason || ""}
                onChange={(e) =>
                  handleInputChange("exitReason", e.target.value)
                }
              />
            </div>

            {/* 복기 메모 */}
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">복기 메모 *</Label>
              <Textarea
                id="reviewNotes"
                placeholder="이번 매매에서 잘한 점, 개선할 점, 배운 점 등을 작성하세요"
                value={exitData.reviewNotes || ""}
                onChange={(e) =>
                  handleInputChange("reviewNotes", e.target.value)
                }
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                💡 Tip: 원칙을 잘 지켰는지, 감정적 판단은 없었는지, 다음에
                개선할 점은 무엇인지 구체적으로 작성하세요.
              </p>
            </div>

            {/* 진입 정보 참고 */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-3">진입 정보 (참고)</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">진입가</span>
                  <p className="font-medium">
                    {trade.entry.entryPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">포지션</span>
                  <p className="font-medium">{trade.entry.positionSize}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">손절가</span>
                  <p className="font-medium text-red-600">
                    {trade.entry.stopLoss.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">목표가</span>
                  <p className="font-medium text-green-600">
                    {trade.entry.targetPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                청산 정보는 수정할 수 없으니 신중하게 입력해주세요.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !calculatedPnL ||
                  !exitData.exitReason ||
                  !exitData.reviewNotes
                }
                className="flex-1"
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                청산 완료
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
