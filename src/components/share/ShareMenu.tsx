import { Copy, Download, Link2 } from "lucide-react";
import { useState } from "react";

import { Popover } from "@components/generics";
import { copyNoteAsMarkdown, downloadNoteAsMarkdown, getShareUrlIfFits } from "@utils";

import type { Note } from "@entities";
import type { Placement } from "@floating-ui/react";
import type { Anchor } from "@hooks/useFloatingMenu";
import type { ComponentType, RefObject } from "react";

const SUCCESS_FEEDBACK_DURATION_MS = 1_000;
const FAILURE_FEEDBACK_DURATION_MS = 1_500;

type Feedback = { row: "link" | "markdown"; ok: boolean };

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
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const shareUrl = open ? getShareUrlIfFits(note) : null;

    const closeAfter = (delayMs: number) => {
        setTimeout(() => {
            setFeedback(null);
            onClose();
        }, delayMs);
    };

    const handleShareLink = async () => {
        if (!shareUrl) {
            return;
        }
        try {
            await navigator.clipboard.writeText(shareUrl);
            setFeedback({ row: "link", ok: true });
            closeAfter(SUCCESS_FEEDBACK_DURATION_MS);
        } catch {
            setFeedback({ row: "link", ok: false });
            closeAfter(FAILURE_FEEDBACK_DURATION_MS);
        }
    };

    const handleCopyMarkdown = async () => {
        try {
            await copyNoteAsMarkdown(note);
            setFeedback({ row: "markdown", ok: true });
            closeAfter(SUCCESS_FEEDBACK_DURATION_MS);
        } catch {
            setFeedback({ row: "markdown", ok: false });
            closeAfter(FAILURE_FEEDBACK_DURATION_MS);
        }
    };

    const handleDownload = () => {
        downloadNoteAsMarkdown(note);
        onClose();
    };

    const linkSublabel = getLinkSublabel(feedback, shareUrl);
    const markdownLabel = getMarkdownLabel(feedback);

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
                sublabel={linkSublabel}
                onClick={handleShareLink}
            />
            <div className="bg-border-soft mx-1 my-0.5 h-px" />
            <ShareItem Icon={Copy} label={markdownLabel} onClick={handleCopyMarkdown} />
            <ShareItem Icon={Download} label="Download .md" onClick={handleDownload} />
        </Popover>
    );
}

function getLinkSublabel(feedback: Feedback | null, shareUrl: string | null): string {
    if (feedback?.row === "link") {
        return feedback.ok ? "Copied" : "Couldn't copy";
    }
    if (shareUrl === null) {
        return "Note too long for a link";
    }
    return "Opens in Ardoise";
}

function getMarkdownLabel(feedback: Feedback | null): string {
    if (feedback?.row === "markdown") {
        return feedback.ok ? "Copied" : "Couldn't copy";
    }
    return "Copy as markdown";
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
