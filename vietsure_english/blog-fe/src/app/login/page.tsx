'use client';

import useUserLoginStore from '@/state-manager/user-login-store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setLogin } = useUserLoginStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BE_HOST || ''}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || 'Đăng nhập không thành công');
      }
      Cookies.set('jwt', data.jwt, { expires: 7 });
      setLogin(data.jwt, data.user);
      router.push('/elearning');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công');
    }
  };

  return (
    <div className="md:col-span-3 flex items-center justify-center my-20 px-4">
      <form onSubmit={handleSubmit} className="bg-blue-50 p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center">Đăng Nhập</h1>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Tài khoản</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Đăng Nhập
        </button>
      </form>
    </div>
  );
}