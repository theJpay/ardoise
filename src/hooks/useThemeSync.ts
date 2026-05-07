import { useEffect } from "react";

import { applyThemeAttributes, mirrorThemeToLocalStorage } from "@services/theme.storage";
import { useSettings } from "@stores/settings.store";

export function useThemeSync() {
    const { settings } = useSettings();

    useEffect(() => {
        applyThemeAttributes(settings.theme, settings.accent);
        mirrorThemeToLocalStorage(settings.theme, settings.accent);
    }, [settings.theme, settings.accent]);
}
