import { DEFAULT_SETTINGS } from "@entities";

import db from "./db";

import type { Settings } from "@entities";

const SETTINGS_ID = "default" as const;

export async function getSettings(): Promise<Settings> {
    const stored = await db.settings.get(SETTINGS_ID);
    if (!stored) {
        return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...stored };
}

export async function updateSettings(settings: Omit<Settings, "id">): Promise<void> {
    await db.settings.put({ ...settings, id: SETTINGS_ID });
}
