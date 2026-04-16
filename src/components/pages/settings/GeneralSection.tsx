import SettingsRow from "./SettingsRow";
import SettingsSection from "./SettingsSection";

function GeneralSection() {
    return (
        <SettingsSection title="General">
            <div className="divide-border-soft flex flex-col divide-y">
                <SettingsRow description="Write or read when opening a note" label="Default mode" />
                <SettingsRow description="Browser spellcheck in the editor" label="Spellcheck" />
                <SettingsRow description="Light and dark mode" label="Theme" />
            </div>
        </SettingsSection>
    );
}

export default GeneralSection;
