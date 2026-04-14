import { Outlet } from "react-router";

import { Rail, SideBar } from "@components";
import { useRegisterGlobalShortcuts } from "@hooks/useRegisterGlobalShortcuts";
import { useIsSidebarOpen } from "@stores/layout.store";

function App() {
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
                <SideBar searchRef={searchRef} />
            </aside>
            <main className="bg-editor-bg h-screen overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default App;
