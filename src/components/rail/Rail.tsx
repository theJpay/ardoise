import { CircleHelp, FileText, PanelLeft, Settings } from "lucide-react";
import { useEditorActions, useIsSidebarOpen } from "@stores/editor.store";

import EditorModeToggler from "./EditorModeToggle";
import LogoMark from "./LogoMark";
import RailButton from "./RailButton";

function Rail() {
    const isSidebarOpen = useIsSidebarOpen();
    const { toggleSidebar } = useEditorActions();

    return (
        <nav
            className="flex flex-col items-center w-12 h-screen bg-bg border-r border-border shrink-0 py-3.5"
            aria-label="Application navigation"
        >
            <LogoMark />

            <div className="flex flex-col items-center gap-0.5 w-full px-1 mt-4">
                <EditorModeToggler />
            </div>

            <div className="w-5 h-px bg-border my-3" />

            <div className="flex flex-col items-center gap-0.5 w-full px-1">
                <RailButton
                    icon={<FileText size={18} strokeWidth={1.5} />}
                    label="My notes"
                    isActive={true}
                    to="/notes"
                />
            </div>

            <div className="flex-1" />

            <div className="flex flex-col items-center gap-0.5 w-full px-1">
                <RailButton
                    icon={<CircleHelp size={18} strokeWidth={1.5} />}
                    label="Keyboard shortcuts"
                />
                <RailButton
                    icon={<PanelLeft size={18} strokeWidth={1.5} />}
                    label="Toggle sidebar"
                    isActive={isSidebarOpen}
                    onClick={toggleSidebar}
                />
                <RailButton
                    icon={<Settings size={18} strokeWidth={1.5} />}
                    label="Settings"
                    to="/settings"
                />
            </div>
        </nav>
    );
}

export default Rail;
