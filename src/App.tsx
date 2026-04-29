import { Outlet } from "react-router";

import { CommandPalette } from "@components/palette";
import { Rail } from "@components/rail";
import { useThemeSync } from "@hooks/useThemeSync";
import { useTrashSweep } from "@queries/useNotesQuery";

function App() {
    useThemeSync();
    useTrashSweep();
    return (
        <div
            className="bg-bg grid h-screen overflow-hidden"
            style={{ gridTemplateColumns: "48px 1fr" }}
        >
            <Rail />
            <main className="h-screen overflow-hidden">
                <Outlet />
            </main>
            <CommandPalette />
        </div>
    );
}

export default App;
