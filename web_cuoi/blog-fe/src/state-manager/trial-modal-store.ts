import { create } from 'zustand';

interface TrialModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useTrialModalStore = create<TrialModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useTrialModalStore;
