import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
}

interface State {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

interface Actions {
  setUser: (user: AdminUser | null) => void;
  logout: () => void;
}

export const useUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: {
        uid: "thai-huong-admin-default",
        email: "admin@thaihuong.vn",
        displayName: "Ban Giám Đốc / Quản Lý SX",
        role: "ADMIN",
      },
      isAuthenticated: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "thai-huong-user-store",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useUserStore;
