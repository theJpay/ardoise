function NoteEditorFooter({ wordCount }: { wordCount: number }) {
    return (
        <div className="h-7.5 px-4 border-t border-border-soft flex items-center justify-between shrink-0">
            <span className="font-mono text-[9px] text-subtle tracking-[0.06em]">
                {wordCount} words
            </span>
            <span className="font-mono text-[9px] text-accent tracking-[0.08em] flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent inline-block" />
                Saved locally
            </span>
        </div>
    );
}

export default NoteEditorFooter;
