import SettingsSection from "./SettingsSection";

function PrivacySection() {
    return (
        <SettingsSection title="Privacy">
            <div className="text-ui-base text-muted flex flex-col gap-3 font-mono">
                <p>
                    Your notes are stored
                    <span className="text-accent"> locally on this device</span>. Nothing is sent to
                    any server.
                </p>
                <p>
                    <span className="text-accent">Ardoise cannot read your notes.</span>
                </p>
            </div>
        </SettingsSection>
    );
}

export default PrivacySection;
