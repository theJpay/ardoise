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
            <main className="flex flex-col bg-surface border-r border-border overflow-hidden">
                <SideBar isLoading={isLoading} error={error} searchRef={searchRef} />
            </main>
            <div className="bg-editor-bg overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}

export default App;
