import { useNavigate } from "react-router";

import { DepletionBar } from "@components/generics";
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
                <button
                    className="text-ui-base bg-danger-surface text-danger border-danger-border hover:bg-danger-surface-hover duration-fast relative flex h-8 shrink-0 items-center justify-center overflow-hidden rounded border px-4 font-medium transition-colors"
                    onClick={trigger}
                >
                    {armed ? "Click again to confirm" : "Delete all"}
                    {armed && <DepletionBar />}
                </button>
            </SettingsRow>
        </SettingsSection>
    );
}

export default DangerZoneSection;
