// components/molecules/reason-input.tsx

"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TypeWithDescription } from "@/components/atoms/type-with-description";
import type { EntryReason } from "@/lib/types/trade";

interface ReasonInputProps {
  index: number;
  reason: EntryReason;
  availableTypes: ReadonlyArray<{
    value: string;
    label: string;
    required: boolean;
  }>;
  canRemove: boolean;
  onUpdate: (field: keyof EntryReason, value: string) => void;
  onRemove: () => void;
}

export const ReasonInput = ({
  index,
  reason,
  availableTypes,
  canRemove,
  onUpdate,
  onRemove,
}: ReasonInputProps) => {
  const isFirstReason = index === 0;

  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <Label className="font-semibold">
          근거 {index + 1} {isFirstReason && "(캔들 패턴 필수)"}
        </Label>
        {canRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isFirstReason ? (
        <TypeWithDescription
          typeLabel="캔들 패턴"
          descriptionLabel="설명"
          typePlaceholder="캔들 패턴을 선택하세요"
          descriptionPlaceholder="예: 일봉에서 상승 장악형 출현, 거래량 동반"
          typeValue={reason.type}
          descriptionValue={reason.description}
          typeOptions={availableTypes.filter((t) => t.required)}
          onTypeChange={(value) => onUpdate("type", value)}
          onDescriptionChange={(value) => onUpdate("description", value)}
          maxHeight="max-h-[300px]"
        />
      ) : (
        <TypeWithDescription
          typeLabel="근거 타입"
          descriptionLabel="설명"
          descriptionPlaceholder="예: RSI 30 이하 과매도 구간"
          typeValue={reason.type}
          descriptionValue={reason.description}
          typeOptions={availableTypes.filter((t) => !t.required)}
          onTypeChange={(value) => onUpdate("type", value)}
          onDescriptionChange={(value) => onUpdate("description", value)}
        />
      )}
    </div>
  );
};
