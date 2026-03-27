import { FileText, Settings } from "lucide-react";

import LogoMark from "./LogoMark";

function Rail() {
    return (
        <aside className="flex flex-col items-center w-12 h-screen bg-bg border-r border-border shrink-0 py-3 gap-1">
            <span className="font-mono font-medium text-accent tracking-tight text-sm mb-3">
                <LogoMark size={22} />
            </span>

            <button className="w-8 h-8 rounded-md flex items-center justify-center text-accent bg-accent-glow transition-colors duration-100">
                <FileText size={14} strokeWidth={1.6} />
            </button>

            <div className="flex-1" />

            <button className="w-8 h-8 rounded-md flex items-center justify-center text-subtle hover:bg-surface hover:text-muted transition-colors duration-100">
                <Settings size={14} strokeWidth={1.6} />
            </button>
        </aside>
    );
}

export default Rail;
