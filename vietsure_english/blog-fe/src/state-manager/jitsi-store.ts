import { create } from 'zustand';

interface JitsiState {
  roomName: string | null;
  isOpen: boolean;
  isMinimized: boolean;
  startMeeting: (roomName: string) => void;
  closeMeeting: () => void;
  setMinimized: (minimized: boolean) => void;
}

const useJitsiStore = create<JitsiState>((set) => ({
  roomName: null,
  isOpen: false,
  isMinimized: false,
  startMeeting: (roomName) => set({ roomName, isOpen: true, isMinimized: false }),
  closeMeeting: () => set({ roomName: null, isOpen: false, isMinimized: false }),
  setMinimized: (minimized) => set({ isMinimized: minimized }),
}));

export default useJitsiStore;
