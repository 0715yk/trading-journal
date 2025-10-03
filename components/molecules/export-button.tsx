// components/molecules/export-button.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { tradesApi } from "@/lib/supabase/api";
import { exportToJSON, exportToCSV } from "@/lib/utils/export-data";

export function ExportButton() {
  const handleExportJSON = async () => {
    try {
      const trades = await tradesApi.getAll();
      if (trades.length === 0) {
        alert("내보낼 데이터가 없습니다.");
        return;
      }
      exportToJSON(trades);
    } catch (error) {
      console.error("Failed to export:", error);
      alert("내보내기 중 오류가 발생했습니다.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const trades = await tradesApi.getAll();
      if (trades.length === 0) {
        alert("내보낼 데이터가 없습니다.");
        return;
      }
      exportToCSV(trades);
    } catch (error) {
      console.error("Failed to export:", error);
      alert("내보내기 중 오류가 발생했습니다.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg">
          <Download className="mr-2 h-4 w-4" />
          내보내기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          JSON 형식
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          CSV 형식 (엑셀)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
