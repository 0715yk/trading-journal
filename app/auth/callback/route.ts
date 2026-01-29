// app/auth/callback/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Next.js 15: cookies()는 비동기. await한 store를 Promise로 넘겨 타입·동작 모두 만족.
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => Promise.resolve(cookieStore),
    });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
