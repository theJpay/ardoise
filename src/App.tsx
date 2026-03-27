import { Outlet } from "react-router";
import { Rail, SideBar } from "@components";
import { useInitNotes } from "@hooks/useInitNotes";

function App() {
    const { isLoading, error } = useInitNotes();

    return (
        <div className="flex h-screen bg-bg overflow-hidden">
            <Rail />
            <main className="flex flex-col w-60 bg-surface border-r border-border shrink-0">
                <SideBar isLoading={isLoading} error={error} />
            </main>
            <div className="flex-1 bg-editor-bg">
                <Outlet />
            </div>
        </div>
    );
}

export default App;
