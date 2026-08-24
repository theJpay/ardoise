import { Share2 } from "lucide-react";
import { useRef, useState } from "react";

import ShareMenu from "./ShareMenu";

import type { Note } from "@entities";

type ShareButtonProps = {
    note: Pick<Note, "title" | "content">;
};

function ShareButton({ note }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <button
                ref={triggerRef}
                className="text-ui-sm text-subtle hover:bg-surface hover:text-muted duration-fast flex h-7 items-center gap-1.5 rounded px-2.5 font-mono transition-colors"
                onClick={() => setIsOpen((v) => !v)}
            >
                <Share2 size={13} strokeWidth={1.5} />
                Share
            </button>
            <ShareMenu
                anchor={{ type: "element", ref: triggerRef }}
                ignoreClickOutsideRef={triggerRef}
                note={note}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}

export default ShareButton;
