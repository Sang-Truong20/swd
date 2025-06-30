import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  count: 3,

  setCount: (count) => set({ count }),

  increase: () =>
    set((state) => ({
      count: state.count + 1,
    })),

  reset: () => set({ count: 0 }),
}));
