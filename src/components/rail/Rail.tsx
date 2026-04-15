import { CircleHelp, File, PanelLeft, Settings } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useMatch } from "react-router";

import { useIsSidebarOpen, useLayoutActions } from "@stores/layout.store";

import EditorModeToggler from "./EditorModeToggle";
import LogoMark from "./LogoMark";
import RailButton from "./RailButton";
import { ShortcutPanel } from "./shortcutPanel";

function Rail() {
    const isSidebarOpen = useIsSidebarOpen();
    const { toggleSidebar } = useLayoutActions();
    const [isShortcutPanelOpen, setIsShortcutPanelOpen] = useState(false);
    const helpRef = useRef<HTMLDivElement>(null);
    const closeShortcutPanel = useCallback(() => setIsShortcutPanelOpen(false), []);
    const isOnNotes = useMatch("/notes/*");

    return (
        <nav
            aria-label="Application navigation"
            className="bg-bg border-border flex h-screen w-12 shrink-0 flex-col items-center border-r py-3.5"
        >
            <LogoMark className="text-accent" />

            <div className="mt-4 flex w-full flex-col items-center gap-0.5 px-1">
                <EditorModeToggler disabled={!isOnNotes} />
            </div>

            <div className="bg-border-soft my-3 h-px w-5" />

            <div className="flex w-full flex-col items-center gap-0.5 px-1">
                <RailButton
                    icon={<File size={16} strokeWidth={1.5} />}
                    label="My notes"
                    to="/notes"
                />
            </div>

            <div className="flex-1" />

            <div className="flex w-full flex-col items-center gap-0.5 px-1">
                <div ref={helpRef}>
                    <RailButton
                        icon={<CircleHelp size={16} strokeWidth={1.5} />}
                        isActive={isShortcutPanelOpen}
                        label="Keyboard shortcuts"
                        onClick={() => setIsShortcutPanelOpen(!isShortcutPanelOpen)}
                    />
                </div>
                <ShortcutPanel
                    anchorRef={helpRef}
                    isOpen={isShortcutPanelOpen}
                    onClose={closeShortcutPanel}
                />
                <RailButton
                    disabled={!isOnNotes}
                    icon={<PanelLeft size={16} strokeWidth={1.5} />}
                    isActive={isSidebarOpen}
                    label="Toggle sidebar"
                    onClick={toggleSidebar}
                />
                <RailButton
                    icon={<Settings size={16} strokeWidth={1.5} />}
                    label="Settings"
                    to="/settings"
                />
            </div>
        </nav>
    );
}

export default Rail;
