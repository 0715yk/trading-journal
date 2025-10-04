// lib/supabase/api.ts

import { supabase } from "./client";
import type { Trade } from "@/lib/types/trade";

export interface UserSettings {
  nickname: string;
  initial_capital: number;
  min_analysis_time: number;
}

// User Settings
export const userApi = {
  getSettings: async (): Promise<UserSettings | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        await supabase.from("user_settings").insert({
          id: user.id,
          nickname: "트레이더",
          initial_capital: 10000000,
          min_analysis_time: 30,
        });
        return {
          nickname: "트레이더",
          initial_capital: 10000000,
          min_analysis_time: 30,
        };
      }
      throw error;
    }

    return {
      nickname: data.nickname,
      initial_capital: data.initial_capital,
      min_analysis_time: data.min_analysis_time,
    };
  },

  updateSettings: async (settings: UserSettings): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.from("user_settings").upsert({
      id: user.id,
      nickname: settings.nickname,
      initial_capital: settings.initial_capital,
      min_analysis_time: settings.min_analysis_time,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  },
};

// Trades API는 그대로 유지
export const tradesApi = {
  getAll: async (): Promise<Trade[]> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((row) => ({
      ...row,
      certificationImage: row.certification_image,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  getById: async (id: string): Promise<Trade | null> => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return {
      ...data,
      certificationImage: data.certification_image,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  create: async (trade: Trade): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.from("trades").insert({
      id: trade.id,
      user_id: user.id,
      created_at: trade.createdAt,
      updated_at: trade.updatedAt,
      status: trade.status,
      checklist: trade.checklist,
      certification_image: trade.certificationImage,
      entry: trade.entry,
      exit: trade.exit,
    });

    if (error) throw error;
  },

  update: async (id: string, updates: Partial<Trade>): Promise<void> => {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status) updateData.status = updates.status;
    if (updates.entry) updateData.entry = updates.entry;
    if (updates.exit) updateData.exit = updates.exit;

    const { error } = await supabase
      .from("trades")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("trades").delete().eq("id", id);

    if (error) throw error;
  },
};

export const quotesApi = {
  getRandom: async (limit: number = 5): Promise<string[]> => {
    const { data, error } = await supabase
      .from("trading_quotes")
      .select("content")
      .eq("is_active", true)
      .limit(limit);

    if (error) throw error;
    return data?.map((q) => q.content) || [];
  },

  getAll: async (): Promise<
    Array<{ id: string; content: string; author: string | null }>
  > => {
    const { data, error } = await supabase
      .from("trading_quotes")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (content: string, author?: string): Promise<void> => {
    const { error } = await supabase
      .from("trading_quotes")
      .insert({ content, author: author || null });

    if (error) throw error;
  },

  update: async (
    id: string,
    content: string,
    author?: string
  ): Promise<void> => {
    const { error } = await supabase
      .from("trading_quotes")
      .update({ content, author: author || null })
      .eq("id", id);

    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("trading_quotes")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
