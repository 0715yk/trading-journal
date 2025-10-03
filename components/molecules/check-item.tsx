// components/molecules/check-item.tsx

"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CheckItem } from "@/lib/constants/final-checks";

interface CheckItemProps {
  item: CheckItem;
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
}

export const CheckItemComponent = ({
  item,
  value,
  onChange,
  showError,
}: CheckItemProps) => {
  const renderOptions = () => {
    if (item.type === "boolean" && item.options) {
      return item.options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={`${item.id}-${option.value}`}
          />
          <Label
            htmlFor={`${item.id}-${option.value}`}
            className="font-normal cursor-pointer"
          >
            {option.label}
          </Label>
        </div>
      ));
    }

    if (item.type === "rating" && item.ratingLabels) {
      return Object.entries(item.ratingLabels).map(([rating, label]) => (
        <div key={rating} className="flex items-center space-x-2">
          <RadioGroupItem value={rating} id={`${item.id}-${rating}`} />
          <Label
            htmlFor={`${item.id}-${rating}`}
            className="font-normal cursor-pointer"
          >
            {rating}점 - {label}
          </Label>
        </div>
      ));
    }

    return null;
  };

  const getQuestionText = () => {
    if (item.type === "rating" && item.threshold) {
      return `${item.question} (최소 ${item.threshold}점 이상)`;
    }
    return item.question;
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{getQuestionText()}</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        {renderOptions()}
      </RadioGroup>

      {showError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{item.failMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
