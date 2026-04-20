import { Outlet } from "react-router";

import { Rail } from "@components/rail";
import { useThemeSync } from "@hooks/useThemeSync";

function App() {
    useThemeSync();
    return (
        <div
            className="bg-bg grid h-screen overflow-hidden"
            style={{ gridTemplateColumns: "48px 1fr" }}
        >
            <Rail />
            <main className="h-screen overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}

export default App;
