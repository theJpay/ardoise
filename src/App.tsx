import { Outlet } from "react-router";

import { NoteList, Sidebar } from "./components/layout";

function App() {
    return (
        <div className="flex h-screen bg-surface overflow-hidden">
            <Sidebar />
            <main className="flex flex-col w-72 border-r border-border-subtle shrink-0">
                <div className="px-4 py-4 border-b border-border-subtle">
                    <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                        Notes
                    </h2>
                </div>
                <NoteList />
            </main>
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}

export default App;
