import { useEffect } from "react";
import { Outlet } from "react-router";

import { CommandPalette } from "@components/palette";
import { Rail } from "@components/rail";
import { useThemeSync } from "@hooks/useThemeSync";
import { sweepExpiredTrash } from "@services/notes.service";

function App() {
    useThemeSync();
    useEffect(() => {
        sweepExpiredTrash().catch((err) => {
            console.error("trash sweep failed", err);
        });
    }, []);
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
