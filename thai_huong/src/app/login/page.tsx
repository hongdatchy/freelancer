"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(res.error || "Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch {
      setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
      {/* Header Logo */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 relative mb-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
          <Image
            src="/images.png"
            alt="Thái Hương Logo"
            width={60}
            height={60}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Đăng Nhập Quản Trị
        </h1>
        <p className="text-xs text-slate-500">
          Cổng quản lý tiến độ 7 mốc sản xuất & lịch thông báo
        </p>
      </div>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form đăng nhập */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Tài khoản / Email:</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thaontt.thaohuong@gmail.com"
              className="pl-10 h-11 text-sm rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Mật khẩu:</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11 text-sm rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all gap-2 mt-2"
        >
          {isSubmitting ? (
            "Đang xác thực..."
          ) : (
            <>
              Đăng Nhập Hệ Thống
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer ghi chú bảo mật */}
      <div className="pt-4 border-t border-slate-100 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Hệ thống bảo mật nội bộ Dược Mỹ Phẩm Thái Hương
        </div>
        <p className="text-[10px] text-slate-400">
          Khách hàng vui lòng truy cập qua đường link tra cứu được chuyên viên gửi riêng.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <Suspense fallback={<div className="text-sm text-slate-500">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
