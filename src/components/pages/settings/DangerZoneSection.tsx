import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@components/generics";
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
                <Button
                    label={armed ? "Click again to confirm" : "Delete all"}
                    variant="danger"
                    onClick={handleClick}
                />
            </SettingsRow>
        </SettingsSection>
    );
}

export default DangerZoneSection;
