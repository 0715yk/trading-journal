// lib/contexts/settings-context.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { userApi, type UserSettings } from "@/lib/supabase/api";

interface SettingsContextType {
  settings: UserSettings | null;
  loading: boolean;
  error: Error | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getSettings();
      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load settings")
      );
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: UserSettings) => {
    try {
      await userApi.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update settings")
      );
      throw err;
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: loadSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
