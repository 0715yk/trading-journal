// components/atoms/type-with-description.tsx

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypeOption {
  value: string;
  label: string;
}

interface TypeWithDescriptionProps {
  typeLabel: string;
  descriptionLabel: string;
  typePlaceholder?: string;
  descriptionPlaceholder: string;
  typeValue: string;
  descriptionValue: string;
  typeOptions: ReadonlyArray<TypeOption>;
  onTypeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  maxHeight?: string;
}

export const TypeWithDescription = ({
  typeLabel,
  descriptionLabel,
  typePlaceholder,
  descriptionPlaceholder,
  typeValue,
  descriptionValue,
  typeOptions,
  onTypeChange,
  onDescriptionChange,
  maxHeight = "max-h-[200px]",
}: TypeWithDescriptionProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>{typeLabel}</Label>
        <Select value={typeValue} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder={typePlaceholder} />
          </SelectTrigger>
          <SelectContent className={maxHeight}>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{descriptionLabel}</Label>
        <Input
          placeholder={descriptionPlaceholder}
          value={descriptionValue}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </>
  );
};
