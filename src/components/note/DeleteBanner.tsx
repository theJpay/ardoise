import { Command, Delete } from "lucide-react";

import { ShortcutKey } from "@components/generics";
import { NoteEntity } from "@entities";

type DeleteBannerProps = {
    noteTitle: string;
};

function DeleteBanner({ noteTitle }: DeleteBannerProps) {
    return (
        <div className="bg-danger-surface border-danger-border text-ui-sm relative flex h-9 shrink-0 items-center justify-between overflow-hidden border-b px-5 font-mono">
            <span className="text-danger">
                Delete &ldquo;{NoteEntity.getTitle({ title: noteTitle })}&rdquo;?
            </span>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <ShortcutKey content={Command} variant="danger" />
                    <ShortcutKey content={Delete} variant="danger" />
                    <span className="text-danger text-ui-sm ml-1">to confirm</span>
                </div>
                <span className="text-subtle text-ui-sm">·</span>
                <span className="text-subtle text-ui-sm">Esc to cancel</span>
            </div>
            <div
                className="bg-danger absolute bottom-0 left-0 h-[1.5px] w-full origin-left"
                style={{ animation: "timer-deplete 3s linear forwards" }}
            />
        </div>
    );
}

export default DeleteBanner;
