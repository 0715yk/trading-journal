// app/trade/[id]/page.tsx

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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { ACCOUNT_TYPES } from "@/lib/constants/trading-rules";
import { TradeActions } from "@/components/molecules/trade-actions";
import { tradesApi } from "@/lib/supabase/api";
import type { Trade } from "@/lib/types/trade";

interface TradeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TradeDetailPage({ params }: TradeDetailPageProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [tradeId, setTradeId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    params.then(({ id }) => {
      setTradeId(id);
      loadTrade(id);
    });
  }, [params]);

  const loadTrade = async (id: string) => {
    setLoading(true);
    try {
      const foundTrade = await tradesApi.getById(id);

      if (!foundTrade) {
        router.push("/");
        return;
      }

      setTrade(foundTrade);
    } catch (error) {
      console.error("Failed to load trade:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || loading || !trade) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  const accountType = ACCOUNT_TYPES.find(
    (t) => t.value === trade.entry.accountType
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant={trade.status === "open" ? "default" : "secondary"}>
              {trade.status === "open" ? "진행 중" : "종료"}
            </Badge>
            <TradeActions tradeId={tradeId} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{trade.entry.symbol}</CardTitle>
                <CardDescription>
                  {accountType?.emoji} {accountType?.label} ·{" "}
                  {new Date(trade.entry.entryTime).toLocaleString("ko-KR")}
                </CardDescription>
              </div>
              {trade.status === "open" && (
                <Button onClick={() => router.push(`/trade/${tradeId}/exit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  청산 입력
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">진입 정보</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">진입가</span>
                  <p className="font-medium text-lg">
                    {trade.entry.entryPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">포지션 크기</span>
                  <p className="font-medium text-lg">
                    {trade.entry.positionSize}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">손절가</span>
                  <p className="font-medium text-lg">
                    {trade.entry.stopLoss.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">목표가</span>
                  <p className="font-medium text-lg">
                    {trade.entry.targetPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">레버리지</span>
                  <p className="font-medium text-lg">{trade.entry.leverage}x</p>
                </div>
              </div>
            </div>

            {trade.entry.additionalNotes && (
              <div>
                <h3 className="font-semibold mb-2">추가 메모</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {trade.entry.additionalNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>매매 원칙 준수 인증서</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={trade.certificationImage}
              alt="매매 원칙 준수 인증서"
              className="rounded-lg shadow-lg max-w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>진입 근거</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trade.checklist.entryReasons.map((reason, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="font-medium mb-1">
                  {index + 1}. {reason.type}
                </div>
                <p className="text-sm text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>분석 메모</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">미시적 분석</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {trade.checklist.microAnalysis}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">거시적 분석</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {trade.checklist.macroAnalysis}
              </p>
            </div>
          </CardContent>
        </Card>

        {trade.exit && (
          <Card>
            <CardHeader>
              <CardTitle>청산 정보</CardTitle>
              <CardDescription>
                {new Date(trade.exit.exitTime).toLocaleString("ko-KR")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">청산가</span>
                  <p className="font-medium text-lg">
                    {trade.exit.exitPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">손익</span>
                  <p
                    className={`font-medium text-lg ${
                      trade.exit.actualPnL >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trade.exit.actualPnL >= 0 ? "+" : ""}
                    {trade.exit.actualPnL.toLocaleString()} (
                    {trade.exit.actualPnLPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">청산 사유</h3>
                <p className="text-sm text-muted-foreground">
                  {trade.exit.exitReason}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">복기 메모</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {trade.exit.reviewNotes}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
