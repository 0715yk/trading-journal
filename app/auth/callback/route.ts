// app/auth/callback/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Next.js 15: cookies()는 비동기이므로 먼저 await.
    // 이미 해석된 cookieStore를 넘겨야 리다이렉트 전에 세션 쿠키가 응답에 포함됨.
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
