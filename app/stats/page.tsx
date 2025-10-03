// app/stats/page.tsx

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
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Percent,
} from "lucide-react";
import { ACCOUNT_TYPES } from "@/lib/constants/trading-rules";
import type { Trade } from "@/lib/types/trade";
import { EquityCurveChart } from "@/components/organisms/equity-curve-chart";
import { ExportButton } from "@/components/molecules/export-button";
import { tradesApi } from "@/lib/supabase/api";
import { useSettings } from "@/lib/contexts/settings-context";

export default function StatsPage() {
  const router = useRouter();
  const { settings, loading } = useSettings();
  const [isMounted, setIsMounted] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [initialCapital, setInitialCapital] = useState(10000000);

  const loadTrades = async () => {
    try {
      const allTrades = await tradesApi.getAll();
      setTrades(allTrades);
    } catch (error) {
      console.error("Failed to load trades:", error);
    }
  };

  // useEffect에 추가
  useEffect(() => {
    setIsMounted(true);
    loadTrades();
  }, []);

  useEffect(() => {
    if (settings) {
      setInitialCapital(settings.initial_capital);
    }
  }, [settings]);

  const stats = useMemo(() => {
    const closedTrades = trades.filter((t) => t.status === "closed" && t.exit);

    if (closedTrades.length === 0) {
      return {
        totalTrades: 0,
        openTrades: trades.filter((t) => t.status === "open").length,
        closedTrades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalPnL: 0,
        avgPnL: 0,
        avgWin: 0,
        avgLoss: 0,
        biggestWin: 0,
        biggestLoss: 0,
        profitFactor: 0,
        avgRiskReward: 0,
        avgAnalysisTime: 0,
        byAccountType: {},
      };
    }

    const wins = closedTrades.filter((t) => t.exit!.actualPnL > 0);
    const losses = closedTrades.filter((t) => t.exit!.actualPnL < 0);

    const totalPnL = closedTrades.reduce(
      (sum, t) => sum + t.exit!.actualPnL,
      0
    );
    const totalWinAmount = wins.reduce((sum, t) => sum + t.exit!.actualPnL, 0);
    const totalLossAmount = Math.abs(
      losses.reduce((sum, t) => sum + t.exit!.actualPnL, 0)
    );

    const pnlValues = closedTrades.map((t) => t.exit!.actualPnL);
    const biggestWin = Math.max(...pnlValues);
    const biggestLoss = Math.min(...pnlValues);

    const avgRiskReward =
      trades.reduce((sum, t) => sum + t.checklist.riskReward.ratio, 0) /
      trades.length;
    const avgAnalysisTime =
      trades.reduce((sum, t) => sum + t.checklist.analysisTime, 0) /
      trades.length;

    // 계정 타입별 통계
    const byAccountType: Record<
      string,
      {
        total: number;
        wins: number;
        losses: number;
        winRate: number;
        totalPnL: number;
      }
    > = {};

    ACCOUNT_TYPES.forEach((type) => {
      const typeTrades = closedTrades.filter(
        (t) => t.entry.accountType === type.value
      );
      const typeWins = typeTrades.filter((t) => t.exit!.actualPnL > 0).length;
      const typeLosses = typeTrades.filter((t) => t.exit!.actualPnL < 0).length;
      const typePnL = typeTrades.reduce((sum, t) => sum + t.exit!.actualPnL, 0);

      byAccountType[type.value] = {
        total: typeTrades.length,
        wins: typeWins,
        losses: typeLosses,
        winRate:
          typeTrades.length > 0 ? (typeWins / typeTrades.length) * 100 : 0,
        totalPnL: typePnL,
      };
    });

    return {
      totalTrades: trades.length,
      openTrades: trades.filter((t) => t.status === "open").length,
      closedTrades: closedTrades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: (wins.length / closedTrades.length) * 100,
      totalPnL,
      avgPnL: totalPnL / closedTrades.length,
      avgWin: wins.length > 0 ? totalWinAmount / wins.length : 0,
      avgLoss: losses.length > 0 ? totalLossAmount / losses.length : 0,
      biggestWin,
      biggestLoss,
      profitFactor: totalLossAmount > 0 ? totalWinAmount / totalLossAmount : 0,
      avgRiskReward,
      avgAnalysisTime,
      byAccountType,
    };
  }, [trades]);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로
            </Button>
          </div>
          {trades.length > 0 && <ExportButton />}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">통계</h1>
          <p className="text-muted-foreground">전체 매매 성과 분석</p>
        </div>

        {/* 기본 통계 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">기본 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>전체 매매</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTrades}</div>
                <p className="text-xs text-muted-foreground">
                  진행중 {stats.openTrades} · 종료 {stats.closedTrades}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>승패</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <span className="text-green-600">{stats.wins}</span> /{" "}
                  <span className="text-red-600">{stats.losses}</span>
                </div>
                <p className="text-xs text-muted-foreground">승 / 패</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>승률</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Percent className="h-6 w-6" />
                  {stats.winRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  종료된 매매 기준
                </p>
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
          </div>
        </div>

        {stats.closedTrades > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>자산 변동 추이</CardTitle>
              <CardDescription>
                시드머니: ₩{initialCapital.toLocaleString()} → 현재: ₩
                {(initialCapital + stats.totalPnL).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquityCurveChart trades={trades} />
            </CardContent>
          </Card>
        )}
        {/* 손익 분석 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">손익 분석</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>평균 이익</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />+{stats.avgWin.toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">수익 매매 평균</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>평균 손실</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                  <TrendingDown className="h-6 w-6" />-
                  {stats.avgLoss.toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">손실 매매 평균</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>손익비 (Profit Factor)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.profitFactor.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">총이익 / 총손실</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>최대 이익</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +{stats.biggestWin.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">단일 매매 최고</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>최대 손실</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.biggestLoss.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">단일 매매 최악</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 원칙 준수 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">원칙 준수</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>평균 리스크/리워드 비율</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  1:{stats.avgRiskReward.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  목표 비율 달성도
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>평균 분석 시간</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.avgAnalysisTime.toFixed(0)}분
                </div>
                <p className="text-xs text-muted-foreground">매매당 평균</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 계정 타입별 통계 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">계정 타입별 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ACCOUNT_TYPES.map((type) => {
              const typeStats = stats.byAccountType[type.value];
              if (!typeStats || typeStats.total === 0) return null;

              return (
                <Card key={type.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{type.emoji}</span>
                      {type.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">전체</span>
                      <span className="font-medium">{typeStats.total}건</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">승패</span>
                      <span className="font-medium">
                        <span className="text-green-600">{typeStats.wins}</span>{" "}
                        /{" "}
                        <span className="text-red-600">{typeStats.losses}</span>
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">승률</span>
                      <span className="font-medium">
                        {typeStats.winRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">총 손익</span>
                      <span
                        className={`font-medium ${
                          typeStats.totalPnL >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {typeStats.totalPnL >= 0 ? "+" : ""}
                        {typeStats.totalPnL.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 빈 상태 */}
        {stats.closedTrades === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">
                아직 종료된 매매가 없습니다
              </h3>
              <p className="text-muted-foreground mb-6">
                매매를 종료하면 통계가 표시됩니다
              </p>
              <Button size="lg" onClick={() => router.push("/")}>
                홈으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
