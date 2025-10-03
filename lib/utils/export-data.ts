// lib/utils/export-data.ts

import type { Trade } from "@/lib/types/trade";

export const exportToJSON = (trades: Trade[]) => {
  const dataStr = JSON.stringify(trades, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `trading-journal-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();

  URL.revokeObjectURL(url);
};

export const exportToCSV = (trades: Trade[]) => {
  const headers = [
    "ID",
    "상태",
    "종목",
    "계정타입",
    "진입시간",
    "진입가",
    "손절가",
    "목표가",
    "포지션",
    "레버리지",
    "청산시간",
    "청산가",
    "손익",
    "손익률(%)",
    "분석시간(분)",
    "진입근거수",
    "리스크비율",
  ];

  const rows = trades.map((trade) => [
    trade.id,
    trade.status === "open" ? "진행중" : "종료",
    trade.entry.symbol,
    trade.entry.accountType,
    new Date(trade.entry.entryTime).toLocaleString("ko-KR"),
    trade.entry.entryPrice,
    trade.entry.stopLoss,
    trade.entry.targetPrice,
    trade.entry.positionSize,
    trade.entry.leverage,
    trade.exit ? new Date(trade.exit.exitTime).toLocaleString("ko-KR") : "",
    trade.exit ? trade.exit.exitPrice : "",
    trade.exit ? trade.exit.actualPnL : "",
    trade.exit ? trade.exit.actualPnLPercent.toFixed(2) : "",
    trade.checklist.analysisTime,
    trade.checklist.entryReasons.length,
    `1:${trade.checklist.riskReward.ratio.toFixed(2)}`,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const BOM = "\uFEFF";
  const dataBlob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `trading-journal-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.click();

  URL.revokeObjectURL(url);
};
