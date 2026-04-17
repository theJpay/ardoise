import { Plus } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@components/generics";
import LogoMark from "@components/rail/LogoMark";
import { useAddNote } from "@hooks/useAddNote";
import { useNotesQuery } from "@queries/useNotesQuery";

function NoteIndex() {
    useEffect(() => {
        document.title = "Ardoise";
    }, []);
    const { notes, isPending } = useNotesQuery();
    const { addNote } = useAddNote();

    if (isPending) {
        return null;
    }

    if (notes.length > 0) {
        return <ResetScreen />;
    }

    return <FirstLaunchScreen onCreateNote={addNote} />;
}

function FirstLaunchScreen({ onCreateNote }: { onCreateNote: () => void }) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-5">
            <LogoMark className="text-accent" size={48} />
            <div className="flex flex-col items-center gap-1.5 text-center">
                <h2 className="text-ui-h2 text-muted font-sans">Your notes, on your device.</h2>
                <p className="text-ui-xs text-subtle font-mono">Nothing leaves this machine.</p>
            </div>
            <Button icon={Plus} label="New note" onClick={onCreateNote} />
        </div>
    );
}

function ResetScreen() {
    return (
        <div className="flex h-full items-center justify-center">
            <LogoMark className="text-dim" size={72} />
        </div>
    );
}

export default NoteIndex;
