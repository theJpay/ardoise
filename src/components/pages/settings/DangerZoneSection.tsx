import { useNavigate } from "react-router";

import { Button } from "@components/generics";
import { useArmedAction } from "@hooks/useArmedAction";
import { useNotesMutations } from "@queries/useNotesQuery";

import SettingsRow from "./SettingsRow";
import SettingsSection from "./SettingsSection";

function DangerZoneSection() {
    const navigate = useNavigate();
    const { hardDeleteAllNotes } = useNotesMutations();
    const { armed, trigger } = useArmedAction({
        onConfirm: async () => {
            await hardDeleteAllNotes();
            navigate("/notes");
        }
    });

    return (
        <SettingsSection title="Danger zone" variant="danger">
            <SettingsRow
                description="Permanently removes all notes from this device"
                label="Delete all notes"
            >
                <Button
                    armed={armed}
                    label={armed ? "Click again to confirm" : "Delete all"}
                    variant="danger"
                    onClick={trigger}
                />
            </SettingsRow>
        </SettingsSection>
    );
}

export default DangerZoneSection;
