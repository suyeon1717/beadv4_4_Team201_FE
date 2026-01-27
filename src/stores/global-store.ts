import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            isSidebarOpen: false,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
        }),
        {
            name: 'giftify-global-storage',
        }
    )
);
