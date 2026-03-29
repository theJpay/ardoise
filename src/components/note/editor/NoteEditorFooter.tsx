function NoteEditorFooter({ wordCount }: { wordCount: number }) {
    return (
        <div className="h-7.5 px-4 border-t border-border-soft flex items-center justify-between shrink-0">
            <span className="font-mono text-ed-meta text-subtle">{wordCount} words</span>
            <span className="font-mono text-ed-meta text-accent flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent inline-block" />
                Saved locally
            </span>
        </div>
    );
}

export default NoteEditorFooter;
