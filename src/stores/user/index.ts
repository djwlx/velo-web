import { getUserInfo } from '@/services/user';
import { create } from 'zustand';

interface UserState {
  user: number;
  increasePopulation: () => void;
  refresh: () => Promise<void>;
}
export const useUser = create<UserState>((set) => ({
  user: 0,
  increasePopulation: () => set((state) => ({ user: state.user + 1 })),
  removeAllBears: () => set({ user: 0 }),
  updateBears: (newUser: UserState['user']) => set({ user: newUser }),
  refresh: async () => {
    try {
      const res = await getUserInfo();
      set({ user: res.data.age });
    } catch {}
  },
}));
