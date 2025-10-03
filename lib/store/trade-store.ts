// lib/store/trade-store.ts

import { create } from "zustand";
import type { Trade } from "@/lib/types/trade";

interface TradeState {
  trades: Trade[];
  selectedTrade: Trade | null;
}

interface TradeActions {
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  selectTrade: (id: string | null) => void;
  loadTrades: (trades: Trade[]) => void;
}

type TradeStore = TradeState & TradeActions;

export const useTradeStore = create<TradeStore>((set) => ({
  // State
  trades: [],
  selectedTrade: null,

  // Actions
  addTrade: (trade) =>
    set((state) => ({
      trades: [...state.trades, trade],
    })),

  updateTrade: (id, updates) =>
    set((state) => ({
      trades: state.trades.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      ),
    })),

  deleteTrade: (id) =>
    set((state) => ({
      trades: state.trades.filter((t) => t.id !== id),
      selectedTrade:
        state.selectedTrade?.id === id ? null : state.selectedTrade,
    })),

  selectTrade: (id) =>
    set((state) => ({
      selectedTrade: id ? state.trades.find((t) => t.id === id) ?? null : null,
    })),

  loadTrades: (trades) => set({ trades }),
}));

// 셀렉터
export const useOpenTrades = () =>
  useTradeStore((state) => state.trades.filter((t) => t.status === "open"));

export const useClosedTrades = () =>
  useTradeStore((state) => state.trades.filter((t) => t.status === "closed"));
