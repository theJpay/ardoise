import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { useNotesMutations } from "@queries/useNotesQuery";

import SettingsRow from "./SettingsRow";
import SettingsSection from "./SettingsSection";

const CONFIRM_TIMEOUT = 3000;

function DangerZoneSection() {
    const navigate = useNavigate();
    const { hardDeleteAllNotes } = useNotesMutations();
    const [armed, setArmed] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleClick = async () => {
        if (!armed) {
            setArmed(true);
            timerRef.current = window.setTimeout(() => setArmed(false), CONFIRM_TIMEOUT);
            return;
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setArmed(false);
        await hardDeleteAllNotes();
        navigate("/notes");
    };

    return (
        <SettingsSection title="Danger zone" variant="danger">
            <SettingsRow
                description="Permanently removes all notes from this device"
                label="Delete all notes"
            >
                <button
                    className="text-ui-base bg-danger-surface text-danger border-danger-border hover:bg-danger-surface-hover duration-fast relative flex h-8 shrink-0 items-center justify-center overflow-hidden rounded border px-4 font-medium transition-colors"
                    onClick={handleClick}
                >
                    {armed ? "Click again to confirm" : "Delete all"}
                    {armed && (
                        <span className="bg-danger animate-timer-deplete absolute bottom-0 left-0 h-[1.5px] w-full origin-left" />
                    )}
                </button>
            </SettingsRow>
        </SettingsSection>
    );
}

export default DangerZoneSection;
