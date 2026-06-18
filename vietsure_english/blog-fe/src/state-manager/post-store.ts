import { ResponsePostDTO } from '@/dto/PostDTO';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  post: ResponsePostDTO | null;
}

interface Actions {
  setPost: (responsePostDTO: ResponsePostDTO) => void;
}

const usePostStore = create<State & Actions>()(
  persist(
    (set) => ({
      post: null,
      setPost: (responsePostDTO: ResponsePostDTO) => set(() => ({ post: responsePostDTO })),
    }),
    {
      name: 'post-store',
      partialize: (state) => ({ post: state.post }),
    }
  )
);

export default usePostStore;
