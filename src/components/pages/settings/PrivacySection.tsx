function PrivacySection() {
    return (
        <div>
            <h1 className="text-ui-h1 text-text mb-5 font-sans">Privacy</h1>
            <div className="text-ui-sm bg-surface text-muted flex flex-col gap-3 rounded p-4 font-mono">
                <p>
                    Your notes are stored
                    <span className="text-accent"> locally on this device</span>. Nothing is sent to
                    any server.
                </p>
                <p>
                    <span className="text-accent">Ardoise cannot read your notes.</span>
                </p>
            </div>
        </div>
    );
}

export default PrivacySection;
