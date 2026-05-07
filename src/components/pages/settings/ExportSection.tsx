import { Download } from "lucide-react";

import { Button } from "@components/generics";
import { useArchivedNotes, useNotes, useTrashedNotes } from "@stores/notes.store";
import { exportNotesToZip } from "@utils";

import SettingsRow from "./SettingsRow";
import SettingsSection from "./SettingsSection";

function ExportSection() {
    const { notes } = useNotes();
    const { archivedNotes } = useArchivedNotes();
    const { trashedNotes } = useTrashedNotes();

    const handleExport = () => {
        exportNotesToZip({
            active: notes,
            archived: archivedNotes,
            trashed: trashedNotes
        });
    };

    return (
        <SettingsSection title="Export">
            <SettingsRow description="Download all your notes as a .zip archive of markdown files. One .md file per note, named by title.">
                <Button icon={Download} label="Export" variant="ghost" onClick={handleExport} />
            </SettingsRow>
        </SettingsSection>
    );
}

export default ExportSection;
