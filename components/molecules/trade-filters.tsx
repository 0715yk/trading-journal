// components/molecules/trade-filters.tsx

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ACCOUNT_TYPES } from "@/lib/constants/trading-rules";

export type TradeStatus = "all" | "open" | "closed";
export type AccountTypeFilter = "all" | "scalp" | "trend" | "sniper";
export type SortBy = "date-desc" | "date-asc" | "pnl-desc" | "pnl-asc";

interface TradeFiltersProps {
  status: TradeStatus;
  accountType: AccountTypeFilter;
  sortBy: SortBy;
  onStatusChange: (value: TradeStatus) => void;
  onAccountTypeChange: (value: AccountTypeFilter) => void;
  onSortByChange: (value: SortBy) => void;
}

export const TradeFilters = ({
  status,
  accountType,
  sortBy,
  onStatusChange,
  onAccountTypeChange,
  onSortByChange,
}: TradeFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>상태</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="open">진행중</SelectItem>
            <SelectItem value="closed">종료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>계정 타입</Label>
        <Select value={accountType} onValueChange={onAccountTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {ACCOUNT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.emoji} {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>정렬</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">최신순</SelectItem>
            <SelectItem value="date-asc">오래된순</SelectItem>
            <SelectItem value="pnl-desc">손익 높은순</SelectItem>
            <SelectItem value="pnl-asc">손익 낮은순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
