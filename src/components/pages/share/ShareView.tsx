import { Share2 } from "lucide-react";
import { lazy, Suspense } from "react";
import { useNavigate } from "react-router";

import { Button } from "@components/generics";
import { NoteEntity } from "@entities";
import { createNote } from "@services/notes.service";

import type { SharePayload } from "@utils";

const NoteViewer = lazy(() => import("@components/preview/NoteViewer"));

type ShareViewProps = {
    payload: SharePayload;
};

function ShareView({ payload }: ShareViewProps) {
    const navigate = useNavigate();

    const handleSave = async () => {
        const note = await createNote(payload);
        navigate(`/notes/${note.id}?mode=edit`, { replace: true });
    };

    return (
        <div className="flex h-full flex-col">
            <div className="border-border-soft flex h-10 shrink-0 items-center justify-between border-b px-5">
                <span className="text-ui-sm text-muted flex items-center gap-2 font-mono">
                    <Share2 size={12} strokeWidth={1.5} />
                    Shared note
                </span>
                <Button label="Save to my notes" onClick={handleSave} />
            </div>
            <div className="flex-1 overflow-auto">
                <div className="px-6 pt-12 pb-48">
                    <div className="mx-auto flex w-full max-w-180 flex-col gap-2">
                        <div className="ardoise-preview">
                            <h1>{NoteEntity.getTitle(payload)}</h1>
                        </div>
                        <Suspense fallback={null}>
                            <NoteViewer content={payload.content} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareView;
