// components/molecules/console-banner.tsx

"use client";

import { useEffect } from "react";

export const ConsoleBanner = () => {
  useEffect(() => {
    const banner = `
%c
 ████████╗██████╗  █████╗ ██████╗ ██╗███╗   ██╗ ██████╗ 
 ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝ 
    ██║   ██████╔╝███████║██║  ██║██║██╔██╗ ██║██║  ███╗
    ██║   ██╔══██╗██╔══██║██║  ██║██║██║╚██╗██║██║   ██║
    ██║   ██║  ██║██║  ██║██████╔╝██║██║ ╚████║╚██████╔╝
    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                                                          
     ██╗ ██████╗ ██╗   ██╗██████╗ ███╗   ██╗ █████╗ ██╗  
     ██║██╔═══██╗██║   ██║██╔══██╗████╗  ██║██╔══██╗██║  
     ██║██║   ██║██║   ██║██████╔╝██╔██╗ ██║███████║██║  
██   ██║██║   ██║██║   ██║██╔══██╗██║╚██╗██║██╔══██║██║  
╚█████╔╝╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║██║  ██║███████╗
 ╚════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝

%c  v0.1.0  %c│  원칙을 지키는 트레이딩

%c  Welcome, trader. Stay disciplined.
    `;

    console.log(
      banner,
      "color: #0ecb81; font-weight: bold; font-size: 11px; line-height: 1.2;",
      "color: #888; font-size: 11px;",
      "color: #666; font-size: 11px;",
      "color: #f6465d; font-weight: bold; font-size: 12px;"
    );

    console.log(
      "%c📊 System Status",
      "color: #0ecb81; font-weight: bold; font-size: 13px; margin-top: 10px;"
    );
    console.log(
      "%c├─ Environment: Production",
      "color: #888; font-size: 11px;"
    );
    console.log("%c├─ Framework: Next.js 14", "color: #888; font-size: 11px;");
    console.log("%c└─ Database: Supabase", "color: #888; font-size: 11px;");

    console.log(
      "\n%c⚠️  개발자 도구 사용 중",
      "color: #f6465d; font-weight: bold; font-size: 12px;"
    );
    console.log(
      "%c   이 콘솔은 디버깅 용도입니다. 의심스러운 코드를 붙여넣지 마세요.",
      "color: #888; font-size: 11px;"
    );
  }, []);

  return null;
};
