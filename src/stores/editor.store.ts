import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type EditorStore = {
    mode: EditorMode;
    isSidebarOpen: boolean;
    actions: {
        setMode: (mode: EditorMode) => void;
        toggleMode: () => void;
        toggleSidebar: () => void;
    };
};

export type EditorMode = "edit" | "preview";

const useEditorStore = create<EditorStore>((set) => ({
    mode: "edit",
    isSidebarOpen: true,

    actions: {
        setMode: (mode: EditorMode) => set({ mode }),
        toggleMode: () => {
            set((state) => ({
                mode: state.mode === "edit" ? "preview" : "edit"
            }));
        },
        toggleSidebar: () => {
            set((state) => ({
                isSidebarOpen: !state.isSidebarOpen
            }));
        }
    }
}));

export const useEditorMode = () => useEditorStore((state) => state.mode);
export const useIsSidebarOpen = () => useEditorStore((state) => state.isSidebarOpen);

export const useEditorActions = () => useEditorStore(useShallow((state) => state.actions));
