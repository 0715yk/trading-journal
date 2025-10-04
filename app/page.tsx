// app/page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, Calendar, Play } from "lucide-react";
import { ACCOUNT_TYPES } from "@/lib/constants/trading-rules";
import { TradeActions } from "@/components/molecules/trade-actions";
import {
  TradeFilters,
  TradeStatus,
  AccountTypeFilter,
  SortBy,
} from "@/components/molecules/trade-filters";
import { tradesApi } from "@/lib/supabase/api";
import type { Trade } from "@/lib/types/trade";
import { useSettings } from "@/lib/contexts/settings-context";
import { draftStorage } from "@/lib/storage/draft-storage";

export default function HomePage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [isMounted, setIsMounted] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDraft, setHasDraft] = useState(false);

  const [statusFilter, setStatusFilter] = useState<TradeStatus>("all");
  const [accountTypeFilter, setAccountTypeFilter] =
    useState<AccountTypeFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");

  useEffect(() => {
    setIsMounted(true);
    loadTrades();

    const draft = draftStorage.getDraft();
    setHasDraft(
      !!draft?.checklist || !!draft?.currentStep || !!draft?.timerState
    );
  }, []);

  const loadTrades = async () => {
    setLoading(true);
    try {
      const data = await tradesApi.getAll();
      setTrades(data);
    } catch (error) {
      console.error("Failed to load trades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueTrade = () => {
    router.push("/trade/new/checklist");
  };

  const handleNewTrade = () => {
    draftStorage.clearDraft();
    router.push("/trade/new/checklist");
  };

  const filteredAndSortedTrades = useMemo(() => {
    let result = [...trades];

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (accountTypeFilter !== "all") {
      result = result.filter((t) => t.entry.accountType === accountTypeFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "pnl-desc":
          const aPnL = a.exit?.actualPnL || 0;
          const bPnL = b.exit?.actualPnL || 0;
          return bPnL - aPnL;
        case "pnl-asc":
          const aPnLAsc = a.exit?.actualPnL || 0;
          const bPnLAsc = b.exit?.actualPnL || 0;
          return aPnLAsc - bPnLAsc;
        default:
          return 0;
      }
    });

    return result;
  }, [trades, statusFilter, accountTypeFilter, sortBy]);

  const calculateStats = () => {
    const closedTrades = trades.filter((t) => t.status === "closed" && t.exit);
    const totalTrades = closedTrades.length;

    if (totalTrades === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        totalPnL: 0,
        avgPnL: 0,
      };
    }

    const wins = closedTrades.filter((t) => t.exit!.actualPnL > 0).length;
    const totalPnL = closedTrades.reduce(
      (sum, t) => sum + t.exit!.actualPnL,
      0
    );

    return {
      totalTrades,
      winRate: (wins / totalTrades) * 100,
      totalPnL,
      avgPnL: totalPnL / totalTrades,
    };
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  const stats = calculateStats();
  const openTrades = filteredAndSortedTrades.filter((t) => t.status === "open");
  const closedTrades = filteredAndSortedTrades.filter(
    (t) => t.status === "closed"
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold truncate">
              <span className="inline-block max-w-full align-bottom">
                {settings?.nickname}의 매매 일지
              </span>
            </h1>
            <p className="text-muted-foreground">원칙을 지키는 트레이딩</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {hasDraft ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleContinueTrade}
                >
                  <Play className="mr-2 h-4 w-4" />
                  매매 이어하기
                </Button>
                <Button size="lg" onClick={handleNewTrade}>
                  <Plus className="mr-2 h-4 w-4" />새 매매 시작
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={handleNewTrade}>
                <Plus className="mr-2 h-4 w-4" />새 매매 시작
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>전체 매매</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trades.length}</div>
              <p className="text-xs text-muted-foreground">
                진행중 {trades.filter((t) => t.status === "open").length} · 종료{" "}
                {trades.filter((t) => t.status === "closed").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>승률</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.winRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">종료된 매매 기준</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>총 손익</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stats.totalPnL >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.totalPnL >= 0 ? "+" : ""}
                {stats.totalPnL.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">누적 손익</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>평균 손익</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stats.avgPnL >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.avgPnL >= 0 ? "+" : ""}
                {stats.avgPnL.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">매매당 평균</p>
            </CardContent>
          </Card>
        </div>

        {trades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>필터 및 정렬</CardTitle>
            </CardHeader>
            <CardContent>
              <TradeFilters
                status={statusFilter}
                accountType={accountTypeFilter}
                sortBy={sortBy}
                onStatusChange={setStatusFilter}
                onAccountTypeChange={setAccountTypeFilter}
                onSortByChange={setSortBy}
              />
            </CardContent>
          </Card>
        )}

        {openTrades.length > 0 && statusFilter !== "closed" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              진행 중인 매매 ({openTrades.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openTrades.map((trade) => {
                const accountType = ACCOUNT_TYPES.find(
                  (t) => t.value === trade.entry.accountType
                );
                return (
                  <Card
                    key={trade.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => router.push(`/trade/${trade.id}`)}
                        >
                          <CardTitle>{trade.entry.symbol}</CardTitle>
                          <CardDescription>
                            {accountType?.emoji} {accountType?.label}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>진행중</Badge>
                          <TradeActions
                            tradeId={trade.id}
                            onDelete={loadTrades}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent
                      className="cursor-pointer"
                      onClick={() => router.push(`/trade/${trade.id}`)}
                    >
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">진입가</span>
                          <span className="font-medium">
                            {trade.entry.entryPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">손절가</span>
                          <span className="font-medium text-red-600">
                            {trade.entry.stopLoss.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">목표가</span>
                          <span className="font-medium text-green-600">
                            {trade.entry.targetPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground pt-2">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">
                            {new Date(trade.entry.entryTime).toLocaleString(
                              "ko-KR"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {closedTrades.length > 0 && statusFilter !== "open" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              종료된 매매 ({closedTrades.length})
            </h2>
            <div className="space-y-4">
              {closedTrades.map((trade) => {
                const accountType = ACCOUNT_TYPES.find(
                  (t) => t.value === trade.entry.accountType
                );
                const isProfit = trade.exit!.actualPnL >= 0;

                return (
                  <Card
                    key={trade.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => router.push(`/trade/${trade.id}`)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {trade.entry.symbol}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {accountType?.emoji} {accountType?.label}
                            </span>
                            <Badge variant="secondary">종료</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                진입
                              </span>
                              <span className="font-medium">
                                {trade.entry.entryPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                청산
                              </span>
                              <span className="font-medium">
                                {trade.exit!.exitPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">
                                {new Date(
                                  trade.exit!.exitTime
                                ).toLocaleDateString("ko-KR")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div
                              className={`text-2xl font-bold flex items-center gap-1 ${
                                isProfit ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isProfit ? (
                                <TrendingUp className="h-5 w-5" />
                              ) : (
                                <TrendingDown className="h-5 w-5" />
                              )}
                              {isProfit ? "+" : ""}
                              {trade.exit!.actualPnL.toLocaleString()}
                            </div>
                            <div
                              className={`text-sm ${
                                isProfit ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isProfit ? "+" : ""}
                              {trade.exit!.actualPnLPercent.toFixed(2)}%
                            </div>
                          </div>
                          <TradeActions
                            tradeId={trade.id}
                            onDelete={loadTrades}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {trades.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">
                아직 매매 기록이 없습니다
              </h3>
              <p className="text-muted-foreground mb-6">
                첫 매매를 시작하고 원칙을 지키는 트레이딩을 시작하세요
              </p>
              <Button size="lg" onClick={handleNewTrade}>
                <Plus className="mr-2 h-4 w-4" />첫 매매 시작하기
              </Button>
            </CardContent>
          </Card>
        )}

        {trades.length > 0 && filteredAndSortedTrades.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-muted-foreground">
                다른 필터 조건을 선택해보세요
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
