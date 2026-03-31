import { Outlet } from "react-router";

import { Rail, SideBar } from "@components";
import { useInitNotes } from "@hooks/useInitNotes";
import { useRegisterGlobalShortcuts } from "@hooks/useRegisterGlobalShortcuts";
import { useIsSidebarOpen } from "@stores/editor.store";

function App() {
    const { isLoading } = useInitNotes();
    const { searchRef } = useRegisterGlobalShortcuts();
    const isSidebarOpen = useIsSidebarOpen();

    return (
        <div
            className="bg-bg grid h-screen overflow-hidden transition-[grid-template-columns] duration-250 ease-in-out"
            style={{
                gridTemplateColumns: isSidebarOpen ? "48px 240px 1fr" : "48px 0px 1fr"
            }}
        >
            <Rail />
            <aside
                aria-label="Sidebar"
                className="bg-surface border-border flex flex-col overflow-hidden border-r"
            >
                <SideBar isLoading={isLoading} searchRef={searchRef} />
            </aside>
            <main className="bg-editor-bg h-screen overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default App;
