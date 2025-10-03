// app/trade/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { tradesApi } from "@/lib/supabase/api";
import type { Trade, TradeEntry, TradeExit } from "@/lib/types/trade";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [tradeId, setTradeId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entryData, setEntryData] = useState<Partial<TradeEntry>>({});
  const [exitData, setExitData] = useState<Partial<TradeExit>>({});

  useEffect(() => {
    setIsMounted(true);

    params.then(({ id }) => {
      setTradeId(id);
      loadTrade(id);
    });
  }, [params]);

  const loadTrade = async (id: string) => {
    setLoading(true);
    try {
      const foundTrade = await tradesApi.getById(id);

      if (!foundTrade) {
        router.push("/");
        return;
      }

      setTrade(foundTrade);
      setEntryData(foundTrade.entry);
      if (foundTrade.exit) {
        setExitData(foundTrade.exit);
      }
    } catch (error) {
      console.error("Failed to load trade:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleEntryChange = (
    field: keyof TradeEntry,
    value: string | number
  ) => {
    setEntryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExitChange = (field: keyof TradeExit, value: string | number) => {
    setExitData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!trade) return;

    setSaving(true);
    try {
      const updatedEntry: TradeEntry = {
        ...trade.entry,
        symbol: entryData.symbol || trade.entry.symbol,
        entryPrice: Number(entryData.entryPrice) || trade.entry.entryPrice,
        stopLoss: Number(entryData.stopLoss) || trade.entry.stopLoss,
        targetPrice: Number(entryData.targetPrice) || trade.entry.targetPrice,
        positionSize:
          Number(entryData.positionSize) || trade.entry.positionSize,
        leverage: Number(entryData.leverage) || trade.entry.leverage,
        additionalNotes: entryData.additionalNotes,
      };

      const updates: Partial<Trade> = {
        entry: updatedEntry,
      };

      if (trade.exit && exitData.exitPrice) {
        const exitPrice = Number(exitData.exitPrice);
        const entryPrice = updatedEntry.entryPrice;
        const positionSize = updatedEntry.positionSize;
        const leverage = updatedEntry.leverage;

        const priceDiff = exitPrice - entryPrice;
        const pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
        const pnlAmount = priceDiff * positionSize * leverage;

        const updatedExit: TradeExit = {
          ...trade.exit,
          exitPrice,
          actualPnL: pnlAmount,
          actualPnLPercent: pnlPercent,
          exitReason: exitData.exitReason || trade.exit.exitReason,
          reviewNotes: exitData.reviewNotes || trade.exit.reviewNotes,
        };

        updates.exit = updatedExit;
      }

      await tradesApi.update(tradeId, updates);
      router.push(`/trade/${tradeId}`);
    } catch (error) {
      console.error("Failed to update trade:", error);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!trade) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>

        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            매매 정보만 수정 가능합니다. 체크리스트와 인증서는 수정할 수
            없습니다.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>진입 정보 수정</CardTitle>
            <CardDescription>{trade.entry.symbol}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">종목명</Label>
              <Input
                id="symbol"
                value={entryData.symbol || ""}
                onChange={(e) => handleEntryChange("symbol", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryPrice">진입가</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.01"
                value={entryData.entryPrice || ""}
                onChange={(e) =>
                  handleEntryChange("entryPrice", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss">손절가</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.01"
                value={entryData.stopLoss || ""}
                onChange={(e) => handleEntryChange("stopLoss", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPrice">목표가</Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                value={entryData.targetPrice || ""}
                onChange={(e) =>
                  handleEntryChange("targetPrice", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionSize">포지션 크기</Label>
              <Input
                id="positionSize"
                type="number"
                step="0.01"
                value={entryData.positionSize || ""}
                onChange={(e) =>
                  handleEntryChange("positionSize", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverage">레버리지</Label>
              <Input
                id="leverage"
                type="number"
                value={entryData.leverage || 1}
                onChange={(e) => handleEntryChange("leverage", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">추가 메모</Label>
              <Textarea
                id="additionalNotes"
                value={entryData.additionalNotes || ""}
                onChange={(e) =>
                  handleEntryChange("additionalNotes", e.target.value)
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {trade.exit && (
          <Card>
            <CardHeader>
              <CardTitle>청산 정보 수정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exitPrice">청산가</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.01"
                  value={exitData.exitPrice || ""}
                  onChange={(e) =>
                    handleExitChange("exitPrice", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitReason">청산 사유</Label>
                <Input
                  id="exitReason"
                  value={exitData.exitReason || ""}
                  onChange={(e) =>
                    handleExitChange("exitReason", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewNotes">복기 메모</Label>
                <Textarea
                  id="reviewNotes"
                  value={exitData.reviewNotes || ""}
                  onChange={(e) =>
                    handleExitChange("reviewNotes", e.target.value)
                  }
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
            size="lg"
            disabled={saving}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            size="lg"
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
}
