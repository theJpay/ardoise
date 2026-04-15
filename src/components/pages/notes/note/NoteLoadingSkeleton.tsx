function NoteLoadingSkeleton() {
    return (
        <div className="flex-1 px-6 py-12">
            <div className="mx-auto flex w-full max-w-[72ch] flex-col gap-2">
                <div className="bg-elevated h-7 w-64 animate-pulse rounded-md" />
                <div className="bg-elevated h-4 w-32 animate-pulse rounded-md" />
                <div className="mt-6 flex flex-col gap-3">
                    <div className="bg-elevated h-4 w-full animate-pulse rounded-md" />
                    <div className="bg-elevated h-4 w-5/6 animate-pulse rounded-md" />
                    <div className="bg-elevated h-4 w-4/6 animate-pulse rounded-md" />
                    <div className="bg-elevated h-4 w-full animate-pulse rounded-md" />
                    <div className="bg-elevated h-4 w-3/6 animate-pulse rounded-md" />
                </div>
            </div>
        </div>
    );
}

export default NoteLoadingSkeleton;
