// app/trade/new/details/page.tsx

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, Save, Lock } from "lucide-react";

import { ACCOUNT_TYPES } from "@/lib/constants/trading-rules";
import type { TradeEntry } from "@/lib/types/trade";
import { draftStorage } from "@/lib/storage/draft-storage";

export default function DetailsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [entry, setEntry] = useState<Partial<TradeEntry>>({
    accountType: "scalp",
  });

  useEffect(() => {
    setIsMounted(true);

    const draft = draftStorage.getDraft();
    if (!draft?.checklist || !draft?.certificationImage) {
      router.push("/trade/new/checklist");
      return;
    }

    const riskReward = draft.checklist.riskReward;
    setEntry((prev) => ({
      ...prev,
      entryPrice: riskReward.entryPrice,
      stopLoss: riskReward.stopLoss,
      targetPrice: riskReward.targetPrice,
      positionSize: riskReward.positionSize,
      leverage: riskReward.leverage,
    }));
  }, [router]);

  const handleInputChange = (
    field: keyof TradeEntry,
    value: string | number
  ) => {
    setEntry((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !entry.symbol ||
      !entry.entryPrice ||
      !entry.stopLoss ||
      !entry.targetPrice ||
      !entry.positionSize ||
      !entry.leverage
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    const draft = draftStorage.getDraft();
    if (!draft) return;

    const completeEntry: TradeEntry = {
      symbol: entry.symbol!,
      accountType: entry.accountType!,
      entryTime: new Date().toISOString(),
      entryPrice: Number(entry.entryPrice),
      stopLoss: Number(entry.stopLoss),
      targetPrice: Number(entry.targetPrice),
      positionSize: Number(entry.positionSize),
      leverage: Number(entry.leverage),
      additionalNotes: entry.additionalNotes,
    };

    draftStorage.saveDraft({
      ...draft,
      entry: completeEntry,
    });

    router.push("/trade/new/confirm");
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>매매 정보 입력</CardTitle>
            <CardDescription>
              실제 진입한 매매 정보를 입력하세요
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="symbol">종목명 *</Label>
              <Input
                id="symbol"
                placeholder="예: BTC/USDT"
                value={entry.symbol || ""}
                onChange={(e) => handleInputChange("symbol", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">계정 타입 *</Label>
              <Select
                value={entry.accountType}
                onValueChange={(value) =>
                  handleInputChange("accountType", value)
                }
              >
                <SelectTrigger id="accountType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.emoji} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                아래 값들은 체크리스트에서 입력한 계획값입니다. 실제 매매는
                반드시 이 값대로 진행해야 합니다.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="entryPrice">진입가 *</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.01"
                value={entry.entryPrice || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss">손절가 *</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.01"
                value={entry.stopLoss || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPrice">목표가 *</Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                value={entry.targetPrice || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionSize">포지션 크기 (수량) *</Label>
              <Input
                id="positionSize"
                type="number"
                step="0.01"
                value={entry.positionSize || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverage">레버리지 *</Label>
              <Input
                id="leverage"
                type="number"
                min="1"
                max="100"
                value={entry.leverage || 1}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">추가 메모 (선택)</Label>
              <Textarea
                id="additionalNotes"
                placeholder="기타 참고사항을 입력하세요"
                value={entry.additionalNotes || ""}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                size="lg"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                이전
              </Button>
              <Button onClick={handleSubmit} className="flex-1" size="lg">
                <Save className="mr-2 h-4 w-4" />
                저장 및 계속
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
