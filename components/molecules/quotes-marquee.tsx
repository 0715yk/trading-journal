// components/molecules/quotes-marquee.tsx

"use client";

import { useState, useEffect } from "react";
import { quotesApi } from "@/lib/supabase/api";

export const QuotesMarquee = () => {
  const [quotes, setQuotes] = useState<string[]>([]);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const data = await quotesApi.getRandom(10);
      setQuotes(data);
    } catch (error) {
      console.error("Failed to load quotes:", error);
    }
  };

  if (quotes.length === 0) return null;

  const repeatedQuotes = [...quotes, ...quotes, ...quotes];

  return (
    <div className="sticky top-14 bg-primary/10 backdrop-blur-sm z-40 overflow-hidden border-b group">
      <div className="flex animate-marquee group-hover:pause whitespace-nowrap py-2 text-sm text-muted-foreground">
        {repeatedQuotes.map((quote, i) => (
          <span key={i} className="mx-8 inline-block">
            💡 {quote}
          </span>
        ))}
      </div>
    </div>
  );
};
