import { Select, Toggle } from "@components/generics";
import { useSettingsMutations, useSettingsQuery } from "@queries/useSettingsQuery";

import AccentSwatchPicker from "./AccentSwatchPicker";
import SettingsRow from "./SettingsRow";
import SettingsSection from "./SettingsSection";

function GeneralSection() {
    const { settings } = useSettingsQuery();
    const { updateSettings } = useSettingsMutations();

    return (
        <SettingsSection title="General">
            <div className="divide-border-soft flex flex-col divide-y">
                <SettingsRow description="Write or read when opening a note" label="Default mode">
                    <Select
                        options={[
                            { value: "edit", label: "Edit" },
                            { value: "preview", label: "Preview" }
                        ]}
                        value={settings.defaultMode}
                        onChange={(defaultMode) => updateSettings({ ...settings, defaultMode })}
                    />
                </SettingsRow>
                <SettingsRow description="Browser spellcheck in the editor" label="Spellcheck">
                    <Toggle
                        checked={settings.spellcheck}
                        onChange={(spellcheck) => updateSettings({ ...settings, spellcheck })}
                    />
                </SettingsRow>
                <SettingsRow description="Light or dark mode" label="Theme">
                    <Select
                        options={[
                            { value: "dark", label: "Dark" },
                            { value: "light", label: "Light" }
                        ]}
                        value={settings.theme}
                        onChange={(theme) => updateSettings({ ...settings, theme })}
                    />
                </SettingsRow>
                <SettingsRow description="Accent color used across the app" label="Accent">
                    <AccentSwatchPicker
                        value={settings.accent}
                        onChange={(accent) => updateSettings({ ...settings, accent })}
                    />
                </SettingsRow>
            </div>
        </SettingsSection>
    );
}

export default GeneralSection;
