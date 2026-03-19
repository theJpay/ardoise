import { NotebookPen, Settings } from "lucide-react";

function Sidebar() {
    return (
        <aside className="flex flex-col h-screen w-56 bg-surface-raised border-r border-border-subtle shrink-0">
            <div className="px-4 py-5">
                <span className="text-text-primary font-semibold tracking-wide text-lg">
                    Ardoise
                </span>
            </div>

            <nav className="flex-1 px-2">
                <ul className="flex flex-col gap-0.5">
                    <li className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-text-primary bg-surface-overlay cursor-pointer">
                        <NotebookPen size={16} />
                        <span>Notes</span>
                    </li>
                    <li className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors duration-150 cursor-pointer">
                        <Settings size={16} />
                        <span>Settings</span>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
