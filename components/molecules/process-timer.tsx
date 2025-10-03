// components/molecules/process-timer.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause } from "lucide-react";

interface ProcessTimerProps {
  minutes: number;
  seconds: number;
  requiredMinutes: number;
  progress: number;
  isActive: boolean;
  isCompleted: boolean;
  onToggle: () => void;
}

export const ProcessTimer = ({
  minutes,
  seconds,
  requiredMinutes,
  progress,
  isActive,
  isCompleted,
  onToggle,
}: ProcessTimerProps) => {
  const formatTime = (m: number, s: number) => {
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-mono font-bold">
              {formatTime(minutes, seconds)}
            </div>
            <div className="text-sm text-muted-foreground">
              목표: {requiredMinutes}분 {isCompleted && "✓ 완료"}
            </div>
          </div>
          <Button
            onClick={onToggle}
            variant={isActive ? "outline" : "default"}
            size="lg"
          >
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                일시정지
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {minutes === 0 && seconds === 0 ? "시작" : "재개"}
              </>
            )}
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
};
