import { Outlet } from "react-router";
import { Rail, SideBar } from "@components";
import { useInitNotes } from "@hooks/useInitNotes";
import { useRegisterGlobalShortcuts } from "@hooks/useRegisterGlobalShortcuts";
import { useIsSidebarOpen } from "@stores/editor.store";

function App() {
    const { isLoading, error } = useInitNotes();
    const { searchRef } = useRegisterGlobalShortcuts();
    const isSidebarOpen = useIsSidebarOpen();

    return (
        <div
            className="grid h-screen bg-bg overflow-hidden transition-[grid-template-columns] duration-250 ease-in-out"
            style={{
                gridTemplateColumns: isSidebarOpen ? "48px 240px 1fr" : "48px 0px 1fr"
            }}
        >
            <Rail />
            <aside
                className="flex flex-col bg-surface border-r border-border overflow-hidden"
                aria-label="Sidebar"
            >
                <SideBar isLoading={isLoading} error={error} searchRef={searchRef} />
            </aside>
            <main className="bg-editor-bg overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}

export default App;
