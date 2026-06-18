'use client';

import { Button } from '@/components/ui/button';
import useUserLoginStore from '@/state-manager/user-login-store';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function UserInfo() {
  const { user, logout } = useUserLoginStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();

    // ❗ xoá cookie để middleware nhận ra
    Cookies.remove('jwt', { path: '/' });

    router.push('/');
    router.refresh(); // đảm bảo middleware chạy lại
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="text-sm flex items-center space-x-4">
      {user ? (
        <>
          <span className="font-semibold text-[#1e3a8a]">👤 {user.username}</span>
          <Button
            onClick={handleLogout}
            className="p-0 h-auto bg-transparent text-red-500 hover:text-red-600 hover:bg-transparent text-sm font-semibold shadow-none border-0"
          >
            Đăng xuất
          </Button>
        </>
      ) : (
        <Button
          onClick={handleLoginRedirect}
          className="p-0 h-auto text-sm font-semibold text-[#1e3a8a] hover:text-[#3b82f6] bg-transparent hover:bg-transparent shadow-none border-0"
        >
          Đăng nhập
        </Button>
      )}
    </div>
  );
}
