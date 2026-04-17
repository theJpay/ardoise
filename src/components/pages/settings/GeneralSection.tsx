import { Select, Toggle } from "@components/generics";
import { useSettingsMutations, useSettingsQuery } from "@queries/useSettingsQuery";

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
                <SettingsRow description="Light and dark mode" label="Theme" />
            </div>
        </SettingsSection>
    );
}

export default GeneralSection;
