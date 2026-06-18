import {create} from 'zustand';

interface State {
  value: string;
}

interface Actions {
  setSearchCondition: () => void;
}

const useSearchConditionStore = create<State & Actions>((set) => ({
  value: "",
  setSearchCondition: () => set((state) => ({ value: state.value})),
}));

export default useSearchConditionStore;