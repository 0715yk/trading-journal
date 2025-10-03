// app/trade/new/confirm/page.tsx

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { tradesApi } from "@/lib/supabase/api";
import { generateId } from "@/lib/utils/id-generator";
import type { Trade, Checklist, TradeEntry } from "@/lib/types/trade";
import { draftStorage } from "@/lib/storage/draft-storage";

export default function ConfirmPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [entry, setEntry] = useState<TradeEntry | null>(null);
  const [certificationImage, setCertificationImage] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const draft = draftStorage.getDraft();

    if (!draft?.checklist || !draft?.entry || !draft?.certificationImage) {
      router.push("/trade/new/checklist");
      return;
    }

    setChecklist(draft.checklist);
    setEntry(draft.entry);
    setCertificationImage(draft.certificationImage);
  }, [router]);

  const handleSave = async () => {
    if (!checklist || !entry || !certificationImage) return;

    setSaving(true);
    try {
      const newTrade: Trade = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        checklist,
        certificationImage,
        entry,
        exit: null,
      };

      await tradesApi.create(newTrade);
      draftStorage.clearDraft();
      router.push(`/trade/${newTrade.id}`);
    } catch (error) {
      console.error("Failed to save trade:", error);
      alert("매매 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!checklist || !entry) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>최종 확인</CardTitle>
            <CardDescription>
              입력한 정보를 확인하고 매매일지를 저장하세요
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">매매 원칙 준수 인증서</h3>
              <img
                src={certificationImage}
                alt="매매 원칙 준수 인증서"
                className="rounded-lg shadow-lg max-w-full"
              />
            </div>

            <div>
              <h3 className="font-semibold mb-3">체크리스트</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">분석 시간</span>
                  <span className="font-medium">
                    {checklist.analysisTime}분
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">진입 근거</span>
                  <span className="font-medium">
                    {checklist.entryReasons.length}개
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">리스크 비율</span>
                  <span className="font-medium">
                    1:{checklist.riskReward.ratio.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">매매 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">종목</span>
                  <span className="font-medium">{entry.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">진입가</span>
                  <span className="font-medium">
                    {entry.entryPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">손절가</span>
                  <span className="font-medium">
                    {entry.stopLoss.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">목표가</span>
                  <span className="font-medium">
                    {entry.targetPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">포지션 크기</span>
                  <span className="font-medium">{entry.positionSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">레버리지</span>
                  <span className="font-medium">{entry.leverage}x</span>
                </div>
              </div>
            </div>

            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                모든 원칙을 준수했습니다. 매매일지를 저장하세요.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                size="lg"
                disabled={saving}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                이전
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                size="lg"
                disabled={saving}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {saving ? "저장 중..." : "매매일지 저장"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
