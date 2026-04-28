import { Copy, Download, Link2 } from "lucide-react";
import { useState } from "react";

import { Popover } from "@components/generics";
import { copyNoteAsMarkdown, downloadNoteAsMarkdown, getShareUrlIfFits } from "@utils";

import type { Note } from "@entities";
import type { Placement } from "@floating-ui/react";
import type { Anchor } from "@hooks/useFloatingMenu";
import type { ComponentType, RefObject } from "react";

const COPIED_FEEDBACK_DURATION_MS = 1_000;

type ShareMenuProps = {
    note: Pick<Note, "title" | "content">;
    anchor: Anchor;
    open: boolean;
    onClose: () => void;
    placement?: Placement;
    ignoreClickOutsideRef?: RefObject<HTMLElement | null>;
};

function ShareMenu({
    note,
    anchor,
    open,
    onClose,
    placement = "bottom-end",
    ignoreClickOutsideRef
}: ShareMenuProps) {
    const [copiedRow, setCopiedRow] = useState<"link" | "markdown" | null>(null);
    const shareUrl = open ? getShareUrlIfFits(note) : null;

    const closeWithDelay = () => {
        setTimeout(() => {
            setCopiedRow(null);
            onClose();
        }, COPIED_FEEDBACK_DURATION_MS);
    };

    const handleShareLink = async () => {
        if (!shareUrl) {
            return;
        }
        await navigator.clipboard.writeText(shareUrl);
        setCopiedRow("link");
        closeWithDelay();
    };

    const handleCopyMarkdown = async () => {
        await copyNoteAsMarkdown(note);
        setCopiedRow("markdown");
        closeWithDelay();
    };

    const handleDownload = () => {
        downloadNoteAsMarkdown(note);
        onClose();
    };

    return (
        <Popover
            anchor={anchor}
            className="w-60 rounded-md p-1"
            ignoreClickOutsideRef={ignoreClickOutsideRef}
            open={open}
            placement={placement}
            onClose={onClose}
        >
            <ShareItem
                disabled={shareUrl === null}
                Icon={Link2}
                label="Share via link"
                sublabel={
                    copiedRow === "link"
                        ? "Copied"
                        : shareUrl === null
                          ? "Note too long for a link"
                          : "Opens in Ardoise"
                }
                onClick={handleShareLink}
            />
            <div className="bg-border-soft mx-1 my-0.5 h-px" />
            <ShareItem
                Icon={Copy}
                label={copiedRow === "markdown" ? "Copied" : "Copy as markdown"}
                onClick={handleCopyMarkdown}
            />
            <ShareItem Icon={Download} label="Download .md" onClick={handleDownload} />
        </Popover>
    );
}

type ShareItemProps = {
    Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
    label: string;
    sublabel?: string;
    disabled?: boolean;
    onClick: () => void;
};

function ShareItem({ Icon, label, sublabel, disabled, onClick }: ShareItemProps) {
    return (
        <button
            className={`group duration-fast flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 transition-colors ${
                disabled ? "pointer-events-none cursor-default" : "hover:bg-accent-surface"
            }`}
            disabled={disabled}
            onClick={onClick}
        >
            <span
                className={`bg-surface flex h-7 w-7 shrink-0 items-center justify-center rounded-sm ${
                    disabled ? "text-dim" : "text-muted"
                }`}
            >
                <Icon size={13} strokeWidth={1.5} />
            </span>
            <span className="flex flex-col items-start">
                <span
                    className={`text-ui-base duration-fast transition-colors ${
                        disabled ? "text-dim" : "text-muted group-hover:text-text"
                    }`}
                >
                    {label}
                </span>
                {sublabel && <span className="text-ui-sm text-subtle font-mono">{sublabel}</span>}
            </span>
        </button>
    );
}

export default ShareMenu;
