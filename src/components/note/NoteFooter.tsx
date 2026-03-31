function NoteFooter({ wordCount }: { wordCount: number }) {
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="border-border-soft flex h-8 shrink-0 items-center justify-between border-t px-5">
            <span className="text-subtle font-mono text-[11px] tracking-[0.04em]">
                {wordCount} words · {readTime} min read
            </span>
            <div className="flex items-center gap-4">
                <span className="text-subtle font-mono text-[10px] tracking-[0.04em]">
                    ⌘B sidebar · ⌘E mode · / commands
                </span>
                <span className="text-accent flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em]">
                    <span className="bg-accent inline-block h-1.25 w-1.25 rounded-full" />
                    Saved locally
                </span>
            </div>
        </div>
    );
}

export default NoteFooter;
