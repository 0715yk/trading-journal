// components/organisms/header.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User as UserIcon,
  BarChart3,
  Home,
  Settings,
  LogOut,
  Info,
} from "lucide-react";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 w-full max-w-full items-center justify-between px-4">
        <div className="mr-4 flex">
          <button
            onClick={() => router.push("/")}
            className="mr-6 flex items-center space-x-2 group"
          >
            <BarChart3 className="h-6 w-6 text-[#0ecb81] group-hover:text-[#f6465d] transition-colors" />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-[#0ecb81] to-[#f6465d] bg-clip-text text-transparent">
              Commitrade
            </span>
          </button>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Button
            variant={pathname === "/" ? "secondary" : "ghost"}
            onClick={() => router.push("/")}
          >
            <Home className="mr-2 h-4 w-4" />홈
          </Button>
          <Button
            variant={pathname === "/stats" ? "secondary" : "ghost"}
            onClick={() => router.push("/stats")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            통계
          </Button>
          <Button
            variant={pathname === "/about" ? "secondary" : "ghost"}
            onClick={() => router.push("/about")}
          >
            <Info className="mr-2 h-4 w-4" />
            소개
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email}
                    </p>
                    {user?.user_metadata?.full_name && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.user_metadata.full_name}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
