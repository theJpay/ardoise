import { liveQuery } from "dexie";
import { create } from "zustand";

import { DEFAULT_SETTINGS } from "@entities";
import { getSettings } from "@services/settings.service";

import type { Settings } from "@entities";

type SettingsStore = {
    settings: Settings;
};

const useSettingsStore = create<SettingsStore>(() => ({
    settings: DEFAULT_SETTINGS
}));

liveQuery(getSettings).subscribe((settings) => {
    useSettingsStore.setState({ settings });
});

export function useSettings() {
    const settings = useSettingsStore((state) => state.settings);

    return { settings };
}
