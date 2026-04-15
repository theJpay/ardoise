import { Outlet } from "react-router";

import { useNotesShortcuts } from "@hooks/useNotesShortcuts";
import { useIsSidebarOpen } from "@stores/layout.store";

import { SideBar } from "./sidebar";

function NotesPage() {
    const { searchRef } = useNotesShortcuts();
    const isSidebarOpen = useIsSidebarOpen();

    return (
        <div
            className="grid h-full transition-[grid-template-columns] duration-250 ease-in-out"
            style={{
                gridTemplateColumns: isSidebarOpen ? "240px 1fr" : "0px 1fr"
            }}
        >
            <aside
                aria-label="Sidebar"
                className="bg-surface border-border flex flex-col overflow-hidden border-r"
            >
                <SideBar searchRef={searchRef} />
            </aside>
            <div className="bg-editor-bg overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default NotesPage;
