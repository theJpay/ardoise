import { create } from "zustand";

const SEEN_KEY = "ardoise:tooltip-mode-seen";

type OnboardingStore = {
    showModeTooltip: boolean;
    actions: {
        triggerModeTooltip: () => void;
        dismissModeTooltip: () => void;
    };
};

const useOnboardingStore = create<OnboardingStore>((set) => ({
    showModeTooltip: false,
    actions: {
        triggerModeTooltip: () => {
            if (!localStorage.getItem(SEEN_KEY)) {
                set({ showModeTooltip: true });
            }
        },
        dismissModeTooltip: () => {
            localStorage.setItem(SEEN_KEY, "true");
            set({ showModeTooltip: false });
        }
    }
}));

export const useShowModeTooltip = () => useOnboardingStore((s) => s.showModeTooltip);

export const useOnboardingActions = () => useOnboardingStore((s) => s.actions);
