import { Outlet } from "react-router";
import { Rail, SideBar } from "@components";

function App() {
    return (
        <div className="flex h-screen bg-bg overflow-hidden">
            <Rail />
            <main className="flex flex-col w-60 bg-surface border-r border-border shrink-0">
                <SideBar />
            </main>
            <div className="flex-1 bg-editor-bg">
                <Outlet />
            </div>
        </div>
    );
}

export default App;
