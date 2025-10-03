// components/organisms/final-checks.tsx

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
import { CheckCircle2 } from "lucide-react";
import { FINAL_CHECK_ITEMS } from "@/lib/constants/final-checks";
import { CheckItemComponent } from "@/components/molecules/check-item";
import { draftStorage } from "@/lib/storage/draft-storage";

interface FinalChecksProps {
  onComplete: (data: Record<string, string | number | boolean>) => void;
  initialData?: Record<string, string | number | boolean>;
  onBack?: () => void;
}

export const FinalChecks = ({
  onComplete,
  initialData = {},
  onBack,
}: FinalChecksProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const draft = draftStorage.getDraft();
    const savedFinalChecks = draft?.checklist?.finalChecks;

    FINAL_CHECK_ITEMS.forEach((item) => {
      let value = initialData[item.id];

      if (value === undefined && savedFinalChecks) {
        value = savedFinalChecks[item.id];
      }

      if (value !== undefined) {
        initial[item.id] = String(value);
      } else {
        initial[item.id] = "";
      }
    });
    return initial;
  });

  const validateAnswer = (itemId: string, value: string): boolean => {
    const item = FINAL_CHECK_ITEMS.find((i) => i.id === itemId);
    if (!item || !value) return true;

    if (item.type === "boolean") {
      return value === item.passCondition;
    }

    if (item.type === "rating" && item.threshold) {
      const numValue = parseInt(value);
      if (item.passCondition === "min") {
        return numValue >= item.threshold;
      }
      if (item.passCondition === "max") {
        return numValue <= item.threshold;
      }
    }

    return true;
  };

  const isAllValid = (): boolean => {
    return FINAL_CHECK_ITEMS.every((item) => {
      const value = answers[item.id];
      return value !== "" && validateAnswer(item.id, value);
    });
  };

  useEffect(() => {
    const finalChecks: Record<string, string | number | boolean> = {};
    FINAL_CHECK_ITEMS.forEach((item) => {
      const value = answers[item.id];
      if (value !== "") {
        if (item.type === "boolean") {
          finalChecks[item.id] = value === "true";
        } else if (item.type === "rating") {
          finalChecks[item.id] = parseInt(value);
        }
      }
    });

    const draft = draftStorage.getDraft();
    draftStorage.updateChecklistData({
      ...(draft?.checklist || {}),
      finalChecks,
    });
  }, [answers]);

  const handleAnswerChange = (itemId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSubmit = () => {
    if (!isAllValid()) return;

    const result: Record<string, string | number | boolean> = {};

    FINAL_CHECK_ITEMS.forEach((item) => {
      const value = answers[item.id];
      if (item.type === "boolean") {
        result[item.id] = value === "true";
      } else if (item.type === "rating") {
        result[item.id] = parseInt(value);
      }
    });

    onComplete(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>최종 확인</CardTitle>
        <CardDescription>매매 전 마지막 체크입니다</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {FINAL_CHECK_ITEMS.map((item) => (
          <CheckItemComponent
            key={item.id}
            item={item}
            value={answers[item.id]}
            onChange={(value) => handleAnswerChange(item.id, value)}
            showError={
              answers[item.id] !== "" &&
              !validateAnswer(item.id, answers[item.id])
            }
          />
        ))}

        {isAllValid() && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              모든 체크를 통과했습니다!
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
            disabled={!isAllValid()}
            className="flex-1"
            size="lg"
          >
            체크리스트 완료
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
