import { Copy, Download } from "lucide-react";
import { useState } from "react";

import { Popover } from "@components/generics";
import { copyNoteAsMarkdown, downloadNoteAsMarkdown } from "@utils";

import type { Note } from "@entities";
import type { Anchor } from "@hooks/useFloatingMenu";
import type { ComponentType, RefObject } from "react";

const COPIED_FEEDBACK_DURATION_MS = 1200;

type ShareMenuProps = {
    note: Pick<Note, "title" | "content">;
    anchor: Anchor;
    open: boolean;
    onClose: () => void;
    ignoreClickOutsideRef?: RefObject<HTMLElement | null>;
};

function ShareMenu({ note, anchor, open, onClose, ignoreClickOutsideRef }: ShareMenuProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await copyNoteAsMarkdown(note);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            onClose();
        }, COPIED_FEEDBACK_DURATION_MS);
    };

    const handleDownload = () => {
        downloadNoteAsMarkdown(note);
        onClose();
    };

    return (
        <Popover
            anchor={anchor}
            className="w-55 rounded-md p-1"
            ignoreClickOutsideRef={ignoreClickOutsideRef}
            open={open}
            placement="bottom-end"
            onClose={onClose}
        >
            <ShareItem
                Icon={Copy}
                label={copied ? "Copied" : "Copy as markdown"}
                onClick={handleCopy}
            />
            <ShareItem Icon={Download} label="Download .md" onClick={handleDownload} />
        </Popover>
    );
}

type ShareItemProps = {
    Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
    label: string;
    onClick: () => void;
};

function ShareItem({ Icon, label, onClick }: ShareItemProps) {
    return (
        <button
            className="group hover:bg-accent-surface duration-fast flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 transition-colors"
            onClick={onClick}
        >
            <span className="bg-surface text-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-sm">
                <Icon size={13} strokeWidth={1.5} />
            </span>
            <span className="text-ui-base text-muted group-hover:text-text duration-fast transition-colors">
                {label}
            </span>
        </button>
    );
}

export default ShareMenu;
