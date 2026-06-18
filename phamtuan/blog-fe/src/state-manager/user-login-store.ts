// stores/user-login-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: any
}

interface State {
  jwt: string | null;
  user: User | null;
}

interface Actions {
  setLogin: (jwt: string, user: User) => void;
  logout: () => void;
}

const useUserLoginStore = create<State & Actions>()(
  persist(
    (set) => ({
      jwt: null,
      user: null,
      setLogin: (jwt, user) => set(() => ({ jwt, user })),
      logout: () => set(() => ({ jwt: null, user: null })),
    }),
    {
      name: 'user-login-store',
      partialize: (state) => ({ jwt: state.jwt, user: state.user }),
    }
  )
);

export default useUserLoginStore;
