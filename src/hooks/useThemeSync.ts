import { useEffect } from "react";

import { useSettingsQuery } from "@queries/useSettingsQuery";
import { applyThemeAttributes, mirrorThemeToLocalStorage } from "@services/theme.storage";

export function useThemeSync() {
    const { settings } = useSettingsQuery();

    useEffect(() => {
        applyThemeAttributes(settings.theme, settings.accent);
        mirrorThemeToLocalStorage(settings.theme, settings.accent);
    }, [settings.theme, settings.accent]);
}
