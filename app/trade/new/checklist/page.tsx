// app/trade/new/checklist/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { EntryReasonsForm } from "@/components/organisms/entry-reasons-form";
import { RiskRewardCalculator } from "@/components/organisms/risk-reward-calculator";
import { AnalysisNotes } from "@/components/organisms/analysis-notes";
import { FinalChecks } from "@/components/organisms/final-checks";
import type {
  Checklist,
  EntryReason,
  RiskRewardCalculation,
} from "@/lib/types/trade";
import { ProcessTimer } from "@/components/molecules/process-timer";
import { draftStorage } from "@/lib/storage/draft-storage";
import { useSettings } from "@/lib/contexts/settings-context";

type Step = "reasons" | "risk-reward" | "analysis" | "final";

export default function ChecklistPage() {
  const router = useRouter();
  const { settings, loading } = useSettings();
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(() => {
    const draft = draftStorage.getDraft();
    return draft?.currentStep || "reasons";
  });

  const [requiredMinutes, setRequiredMinutes] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(() => {
    const draft = draftStorage.getDraft();
    return draft?.timerState?.isActive || false;
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    const draft = draftStorage.getDraft();
    return draft?.timerState?.elapsedSeconds || 0;
  });
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [checklistData, setChecklistData] = useState<Partial<Checklist>>(() => {
    const draft = draftStorage.getDraft();
    return draft?.checklist || {};
  });

  const requiredSeconds = requiredMinutes * 60;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const progress = Math.min((elapsedSeconds / requiredSeconds) * 100, 100);
  const isTimeCompleted = elapsedSeconds >= requiredSeconds;

  useEffect(() => {
    if (settings) {
      setRequiredMinutes(settings.min_analysis_time);
    }
  }, [settings]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    draftStorage.updateTimerState({
      elapsedSeconds,
      isActive: isTimerActive,
    });
  }, [elapsedSeconds, isTimerActive, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    draftStorage.updateCurrentStep(currentStep);
  }, [currentStep, isMounted]);

  useEffect(() => {
    if (!isTimerActive) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
    }

    const updateTimer = () => {
      if (startTimeRef.current === null) return;

      const now = Date.now();
      const newElapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
      setElapsedSeconds(newElapsedSeconds);

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTimerActive, elapsedSeconds]);

  useEffect(() => {
    if (!isTimerActive || isTimeCompleted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "분석 시간이 아직 부족합니다. 정말 나가시겠습니까?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isTimerActive, isTimeCompleted]);

  const handleTimerToggle = () => {
    if (!isTimerActive) {
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
    }
    setIsTimerActive(!isTimerActive);
  };

  const handleReasonsComplete = (reasons: EntryReason[]) => {
    const updatedData = { ...checklistData, entryReasons: reasons };
    setChecklistData(updatedData);
    draftStorage.updateChecklistData(updatedData);
    setCurrentStep("risk-reward");
  };

  const handleRiskRewardComplete = (calculation: RiskRewardCalculation) => {
    const updatedData = { ...checklistData, riskReward: calculation };
    setChecklistData(updatedData);
    draftStorage.updateChecklistData(updatedData);
    setCurrentStep("analysis");
  };

  const handleAnalysisComplete = (data: {
    microAnalysis: string;
    macroAnalysis: string;
  }) => {
    const updatedData = { ...checklistData, ...data };
    setChecklistData(updatedData);
    draftStorage.updateChecklistData(updatedData);
    setCurrentStep("final");
  };

  const handleFinalComplete = (
    data: Record<string, string | number | boolean>
  ) => {
    if (!isTimeCompleted) {
      alert(
        `아직 분석 시간이 부족합니다. ${
          requiredMinutes - minutes
        }분 더 필요합니다.`
      );
      return;
    }

    const completeChecklist: Checklist = {
      analysisTime: minutes,
      entryReasons: checklistData.entryReasons!,
      riskReward: checklistData.riskReward!,
      microAnalysis: checklistData.microAnalysis!,
      macroAnalysis: checklistData.macroAnalysis!,
      finalChecks: data,
    };

    draftStorage.saveDraft({ checklist: completeChecklist });
    router.push("/trade/new/entry");
  };

  const goToPreviousStep = () => {
    const stepOrder: Step[] = ["reasons", "risk-reward", "analysis", "final"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const steps: { id: Step; title: string }[] = [
    { id: "reasons", title: "진입 근거" },
    { id: "risk-reward", title: "리스크 계산" },
    { id: "analysis", title: "분석 메모" },
    { id: "final", title: "최종 확인" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <ProcessTimer
          minutes={minutes}
          seconds={seconds}
          requiredMinutes={requiredMinutes}
          progress={progress}
          isActive={isTimerActive}
          isCompleted={isTimeCompleted}
          onToggle={handleTimerToggle}
        />
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>체크리스트 진행</span>
            <span>
              {currentStepIndex + 1} / {steps.length}
            </span>
          </div>
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStepIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm font-medium">
            {steps.map((step) => (
              <span
                key={step.id}
                className={
                  currentStep === step.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {currentStep === "reasons" && (
          <EntryReasonsForm
            onComplete={handleReasonsComplete}
            initialReasons={checklistData.entryReasons}
          />
        )}

        {currentStep === "risk-reward" && (
          <RiskRewardCalculator
            onComplete={handleRiskRewardComplete}
            initialData={checklistData.riskReward}
            onBack={goToPreviousStep}
          />
        )}

        {currentStep === "analysis" && (
          <AnalysisNotes
            onComplete={handleAnalysisComplete}
            initialData={{
              microAnalysis: checklistData.microAnalysis,
              macroAnalysis: checklistData.macroAnalysis,
            }}
            onBack={goToPreviousStep}
          />
        )}

        {currentStep === "final" && (
          <FinalChecks
            onComplete={handleFinalComplete}
            initialData={checklistData.finalChecks}
            onBack={goToPreviousStep}
          />
        )}
      </div>
    </div>
  );
}
