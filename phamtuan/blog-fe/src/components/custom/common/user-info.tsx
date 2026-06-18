'use client';

import useUserLoginStore from '@/state-manager/user-login-store';
import { useRouter } from 'next/navigation';

export default function UserInfo() {
  const { user, logout } = useUserLoginStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="text-sm flex items-center space-x-4">
      {user ? (
        <>
          <span className="font-semibold">👤 {user.username}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Đăng xuất
          </button>
        </>
      ) : (
        <button
          onClick={handleLoginRedirect}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Đăng nhập
        </button>
      )}
    </div>
  );
}
