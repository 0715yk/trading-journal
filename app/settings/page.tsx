// app/settings/page.tsx

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { UserSettings } from "@/lib/supabase/api";
import { useSettings } from "@/lib/contexts/settings-context";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, loading, updateSettings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    nickname: "",
    initial_capital: 0,
    min_analysis_time: 0,
  });

  useEffect(() => {
    if (settings) {
      setUserSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(userSettings);
      router.push("/");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>

        <div>
          <h1 className="text-3xl font-bold mb-2">설정</h1>
          <p className="text-muted-foreground">
            프로필 및 매매 설정을 관리합니다
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>프로필</CardTitle>
            <CardDescription>닉네임과 초기 자산을 설정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                value={userSettings.nickname}
                onChange={(e) =>
                  setUserSettings({ ...userSettings, nickname: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialCapital">초기 자산 (원)</Label>
              <Input
                id="initialCapital"
                type="number"
                value={userSettings.initial_capital}
                onChange={(e) =>
                  setUserSettings({
                    ...userSettings,
                    initial_capital: Number(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                차트 계산 시 사용되는 시드머니입니다
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>매매 원칙</CardTitle>
            <CardDescription>
              체크리스트 작성 시 적용되는 기준을 설정하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minAnalysisTime">최소 분석 시간 (분)</Label>
              <Input
                id="minAnalysisTime"
                type="number"
                min="1"
                value={userSettings.min_analysis_time}
                onChange={(e) =>
                  setUserSettings({
                    ...userSettings,
                    min_analysis_time: Number(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                매매 시작 전 최소한으로 분석해야 하는 시간입니다
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          className="w-full"
          size="lg"
          disabled={saving}
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}
