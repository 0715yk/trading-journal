// middleware.ts

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 로그인 페이지는 항상 접근 가능
  if (req.nextUrl.pathname === "/login") {
    // 이미 로그인된 경우 홈으로 리다이렉트
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return res;
  }

  // auth callback은 항상 허용
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    return res;
  }

  // 로그인 안 된 경우 로그인 페이지로
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
