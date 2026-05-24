import { Link2Off } from "lucide-react";

function ShareError() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2.5">
            <Link2Off className="text-subtle" size={16} strokeWidth={1.5} />
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-ui-base text-muted font-medium">Invalid share link</p>
                <p className="text-ui-sm text-subtle max-w-60">
                    This shared link is invalid or corrupted.
                </p>
            </div>
        </div>
    );
}

export default ShareError;
