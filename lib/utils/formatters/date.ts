// lib/utils/formatters/date.ts

import { format } from "date-fns";
import { ko } from "date-fns/locale";

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "yyyy-MM-dd", { locale: ko });
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss", { locale: ko });
};

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), "HH:mm:ss", { locale: ko });
};
