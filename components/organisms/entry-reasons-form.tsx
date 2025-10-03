// components/organisms/entry-reasons-form.tsx

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, CheckCircle2 } from "lucide-react";
import { TRADING_RULES, REASON_TYPES } from "@/lib/constants/trading-rules";
import { ReasonInput } from "@/components/molecules/reason-input";
import type { EntryReason } from "@/lib/types/trade";
import { draftStorage } from "@/lib/storage/draft-storage";

interface EntryReasonsFormProps {
  onComplete: (reasons: EntryReason[]) => void;
  initialReasons?: EntryReason[];
  onBack?: () => void;
}

export const EntryReasonsForm = ({
  onComplete,
  initialReasons = [],
  onBack,
}: EntryReasonsFormProps) => {
  const candlePatterns = REASON_TYPES.filter((t) => t.required);
  const firstPattern = candlePatterns[0].value;

  const [reasons, setReasons] = useState<EntryReason[]>(() => {
    if (initialReasons.length > 0) return initialReasons;
    const draft = draftStorage.getDraft();
    if (
      draft?.checklist?.entryReasons &&
      draft.checklist.entryReasons.length > 0
    ) {
      return draft.checklist.entryReasons;
    }
    return [{ type: firstPattern, description: "" }];
  });

  const minReasons = TRADING_RULES.MIN_ENTRY_REASONS;
  const isValid =
    reasons.length >= minReasons &&
    reasons.every((r) => r.description.trim() !== "");

  useEffect(() => {
    const draft = draftStorage.getDraft();
    draftStorage.updateChecklistData({
      ...(draft?.checklist || {}),
      entryReasons: reasons,
    });
  }, [reasons]);

  const addReason = () => {
    setReasons([...reasons, { type: "indicator", description: "" }]);
  };

  const removeReason = (index: number) => {
    setReasons(reasons.filter((_, i) => i !== index));
  };

  const updateReason = (
    index: number,
    field: keyof EntryReason,
    value: string
  ) => {
    const updated = [...reasons];
    updated[index] = { ...updated[index], [field]: value };
    setReasons(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>원칙 1: 진입 근거</CardTitle>
        <CardDescription>
          최소 {minReasons}개 이상의 근거가 필요합니다. 첫 번째는 반드시 캔들
          차트 패턴이어야 합니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {reasons.map((reason, index) => (
          <ReasonInput
            key={index}
            index={index}
            reason={reason}
            availableTypes={REASON_TYPES}
            canRemove={index > 0}
            onUpdate={(field, value) => updateReason(index, field, value)}
            onRemove={() => removeReason(index)}
          />
        ))}

        <Button variant="outline" onClick={addReason} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          근거 추가
        </Button>

        {isValid ? (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {reasons.length}개의 근거가 작성되었습니다!
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertDescription>
              {reasons.length < minReasons
                ? `${minReasons - reasons.length}개 더 필요합니다`
                : "모든 근거의 설명을 입력해주세요"}
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
            onClick={() => onComplete(reasons)}
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
