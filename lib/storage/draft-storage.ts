// lib/storage/draft-storage.ts

import type { Checklist, TradeEntry } from "@/lib/types/trade";

const DRAFT_KEY = "trading-journal-draft";

type Step = "reasons" | "risk-reward" | "analysis" | "final";

export interface TradeDraft {
  checklist?: Checklist;
  certificationImage?: string;
  entry?: TradeEntry;
  currentStep?: Step;
  timerState?: {
    elapsedSeconds: number;
    isActive: boolean;
  };
}

export const draftStorage = {
  saveDraft: (draft: TradeDraft): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  },

  getDraft: (): TradeDraft | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearDraft: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(DRAFT_KEY);
  },

  updateChecklistData: (checklistData: Partial<Checklist>): void => {
    if (typeof window === "undefined") return;
    const current = draftStorage.getDraft() || {};
    draftStorage.saveDraft({
      ...current,
      checklist: {
        ...current.checklist,
        ...checklistData,
      } as Checklist,
    });
  },

  updateTimerState: (timerState: {
    elapsedSeconds: number;
    isActive: boolean;
  }): void => {
    if (typeof window === "undefined") return;
    const current = draftStorage.getDraft() || {};
    draftStorage.saveDraft({
      ...current,
      timerState,
    });
  },

  updateCurrentStep: (step: Step): void => {
    if (typeof window === "undefined") return;
    const current = draftStorage.getDraft() || {};
    draftStorage.saveDraft({
      ...current,
      currentStep: step,
    });
  },
};
