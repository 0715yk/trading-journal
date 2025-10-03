// components/organisms/analysis-notes.tsx

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { draftStorage } from "@/lib/storage/draft-storage";

interface AnalysisNotesProps {
  onComplete: (data: { microAnalysis: string; macroAnalysis: string }) => void;
  initialData?: { microAnalysis?: string; macroAnalysis?: string };
  onBack?: () => void;
}

export const AnalysisNotes = ({
  onComplete,
  initialData,
  onBack,
}: AnalysisNotesProps) => {
  const [microAnalysis, setMicroAnalysis] = useState(() => {
    if (initialData?.microAnalysis) return initialData.microAnalysis;
    const draft = draftStorage.getDraft();
    return draft?.checklist?.microAnalysis || "";
  });

  const [macroAnalysis, setMacroAnalysis] = useState(() => {
    if (initialData?.macroAnalysis) return initialData.macroAnalysis;
    const draft = draftStorage.getDraft();
    return draft?.checklist?.macroAnalysis || "";
  });

  const isValid =
    microAnalysis.trim().length > 0 && macroAnalysis.trim().length > 0;

  useEffect(() => {
    const draft = draftStorage.getDraft();
    draftStorage.updateChecklistData({
      ...(draft?.checklist || {}),
      microAnalysis,
      macroAnalysis,
    });
  }, [microAnalysis, macroAnalysis]);

  const handleSubmit = () => {
    if (isValid) {
      onComplete({ microAnalysis, macroAnalysis });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>분석 메모</CardTitle>
        <CardDescription>
          미시적 관점과 거시적 관점 모두를 기록하세요
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div>
            <Label htmlFor="micro" className="text-base font-semibold">
              미시적 분석 (15분, 1시간, 4시간, 일봉)
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              최근 짧은 범위 내에서 세력들의 움직임
            </p>
          </div>
          <Textarea
            id="micro"
            placeholder="예: 4시간봉에서 상승 장악형 출현, 15분봉 RSI 과매도 구간 진입..."
            value={microAnalysis}
            onChange={(e) => setMicroAnalysis(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="macro" className="text-base font-semibold">
              거시적 분석 (주봉, 월봉, 연봉)
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              큰 단위에서의 세력 싸움과 전체적인 흐름
            </p>
          </div>
          <Textarea
            id="macro"
            placeholder="예: 주봉 기준 장기 상승 추세 유지 중, 월봉에서 주요 저항선 돌파 시도..."
            value={macroAnalysis}
            onChange={(e) => setMacroAnalysis(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>

        {isValid && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              미시적, 거시적 분석이 모두 작성되었습니다
            </AlertDescription>
          </Alert>
        )}
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
