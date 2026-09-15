"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Layers, LogOut, UserCheck, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const isCustomerPage = pathname.startsWith("/track");
  const isLoginPage = pathname === "/login";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href={isAuthenticated ? "/" : (isCustomerPage ? pathname : "/login")} className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1">
            <Image
              src="/images.png"
              alt="Dược Mỹ Phẩm Thái Hương"
              width={44}
              height={44}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight block leading-tight">
              THÁI HƯƠNG SCHEDULE
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Hệ Thống Theo Dõi Tiến Độ Sản Xuất & Thông Báo 2 Bên
            </span>
          </div>
        </Link>

        {/* Navigation & Auth controls */}
        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  pathname === "/"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Quản Lý Đơn Hàng</span>
              </Link>

              <span className="hidden md:flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Quản Trị Viên
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-9 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng Xuất</span>
              </Button>
            </>
          ) : isCustomerPage ? (
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-blue-50/70 border border-blue-200/60 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Cổng Tra Cứu Khách Hàng</span>
            </span>
          ) : !isLoginPage ? (
            <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs text-blue-700 border-blue-300 hover:bg-blue-50">
              <Link href="/login">
                <LogIn className="w-3.5 h-3.5" />
                Đăng Nhập
              </Link>
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export default Header;
