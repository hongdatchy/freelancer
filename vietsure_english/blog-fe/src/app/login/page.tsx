'use client';

import useUserLoginStore from '@/state-manager/user-login-store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useBreadcrumb } from '@/context/useBreadcrumb';

const REMEMBER_KEY = 'vietsure_remember';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setLogin } = useUserLoginStore();
  const { setMenuState } = useBreadcrumb();
  const router = useRouter();

  // Load saved credentials on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const { savedEmail, savedPassword } = JSON.parse(saved);
        setEmail(savedEmail || '');
        setPassword(savedPassword || '');
        setRememberMe(true);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BE_HOST || ''}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || 'Đăng nhập không thành công');
      }

      // Save or clear credentials based on rememberMe
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, JSON.stringify({ savedEmail: email, savedPassword: password }));
        Cookies.set('jwt', data.jwt, { expires: 30 });
      } else {
        localStorage.removeItem(REMEMBER_KEY);
        Cookies.set('jwt', data.jwt, { expires: 1 });
      }

      setLogin(data.jwt, data.user);
      setMenuState({ itemTitle: 'Elearning', itemHref: '/elearning', level: 'item' });
      router.push('/elearning');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:col-span-3 relative min-h-[55vh] flex items-center justify-center overflow-hidden">

      {/* Background: hero gradient colors */}
      <div className="absolute inset-0 bg-white z-0" />
      <div aria-hidden="true" className="absolute top-0 right-0 w-[55%] h-[55%] bg-[radial-gradient(circle_at_top_right,rgba(254,243,199,0.45)_0%,transparent_70%)] z-0 pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-[60%] h-[65%] bg-[radial-gradient(circle_at_bottom_right,rgba(239,246,255,0.7)_0%,transparent_70%)] z-0 pointer-events-none" />
      <div aria-hidden="true" className="absolute top-0 left-0 w-[45%] h-[50%] bg-[radial-gradient(circle_at_top_left,rgba(219,234,254,0.5)_0%,transparent_70%)] z-0 pointer-events-none" />

      {/* Background mascot image bottom-right */}
      <div aria-hidden="true" className="absolute right-[-5%] bottom-[-5%] w-1/3 opacity-15 pointer-events-none hidden lg:block z-0">
        <Image
          alt=""
          width={400}
          height={300}
          src="/images/hao-hung-san-sang.png"
          className="w-full h-auto"
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-[0_20px_60px_rgba(46,53,127,0.15)] border border-blue-100 p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-xl md:text-2xl font-black text-[#2E357F] uppercase tracking-wide">
              Giáo viên đăng nhập
            </h1>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Tài khoản */}
            <div>
              <label className="block text-sm font-bold text-[#2E357F] mb-1.5">Tài khoản</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-blue-100 focus:border-[#3F489A] outline-none px-4 py-2.5 rounded-2xl text-[#2E357F] font-semibold text-sm transition-colors bg-white placeholder:text-slate-300"
                placeholder="Nhập tài khoản..."
                required
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-bold text-[#2E357F] mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-blue-100 focus:border-[#3F489A] outline-none px-4 py-2.5 pr-11 rounded-2xl text-[#2E357F] font-semibold text-sm transition-colors bg-white placeholder:text-slate-300"
                  placeholder="Nhập mật khẩu..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3F489A]/50 hover:text-[#3F489A] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Ghi nhớ đăng nhập */}
            <div className="flex items-center gap-2.5">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => {
                  setRememberMe(e.target.checked);
                  if (!e.target.checked) localStorage.removeItem(REMEMBER_KEY);
                }}
                className="w-4 h-4 rounded accent-[#3F489A] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm font-semibold text-[#2E357F] cursor-pointer select-none">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3F489A] hover:bg-[#2E357F] disabled:opacity-60 text-white font-extrabold py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg text-base tracking-wide mt-2"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}