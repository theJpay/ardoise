import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type LayoutStore = {
    isSidebarOpen: boolean;
    actions: {
        toggleSidebar: () => void;
    };
};

const useLayoutStore = create<LayoutStore>((set) => ({
    isSidebarOpen: true,
    actions: {
        toggleSidebar: () => {
            set((state) => ({
                isSidebarOpen: !state.isSidebarOpen
            }));
        }
    }
}));

export const useIsSidebarOpen = () => useLayoutStore((state) => state.isSidebarOpen);

export const useLayoutActions = () => useLayoutStore(useShallow((state) => state.actions));
