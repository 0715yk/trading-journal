// app/auth/callback/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", requestUrl.origin));
  }

  try {
    const cookieStore = await cookies();
    // auth-helpers 어댑터는 cookies() 반환값을 동기적으로 .get/.set 함.
    // Next.js 15는 cookies()가 async이므로 먼저 await한 store를 넘겨야 함.
    const supabase = createRouteHandlerClient({
      cookies: (() => cookieStore) as unknown as () => ReturnType<typeof cookies>,
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
      return NextResponse.redirect(new URL("/login?error=auth_failed", requestUrl.origin));
    }
  } catch (e) {
    console.error("[auth/callback]", e);
    return NextResponse.redirect(new URL("/login?error=server_error", requestUrl.origin));
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
