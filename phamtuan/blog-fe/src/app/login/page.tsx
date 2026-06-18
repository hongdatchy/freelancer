'use client';

import useUserLoginStore from '@/state-manager/user-login-store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setLogin, logout, jwt, user } = useUserLoginStore();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BE_HOST || ''}/api/auth/local/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: email,
            email: email,
            password: password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error?.message || 'Đăng ký không thành công');
        }

        setSuccess('Đăng ký thành công! Mời bạn đăng nhập.');
        setIsRegister(false); // chuyển lại về form đăng nhập
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } catch (err: any) {
        setError(err.message || 'Đăng ký không thành công');
      }
    } else {
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

        console.log('Đăng nhập thành công:', data);
        setLogin(data.jwt, data.user);
        router.push('/');
      } catch (err: any) {
        setError(err.message || 'Đăng nhập không thành công');
      }
    }
  };

  return (
    <div className="md:col-span-3 flex items-center justify-center mb-20 px-4">
      <form onSubmit={handleSubmit} className="bg-blue-50 p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center">{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</h1>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email hoặc Username</label>
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

        {isRegister && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isRegister ? 'Đăng Ký' : 'Đăng Nhập'}
        </button>

        <div className="mt-4 text-right text-sm">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setError('');
              setSuccess('');
              setIsRegister(!isRegister);
            }}
          >
            {isRegister ? 'Quay về đăng nhập' : 'Đăng ký'}
          </button>
        </div>
      </form>
    </div>
  );
}
