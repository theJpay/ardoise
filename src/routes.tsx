import { createBrowserRouter, Navigate } from "react-router";
import { Note } from "@components";

import App from "./App.tsx";

export const router = createBrowserRouter([
    {
        path: "/notes",
        Component: App,
        children: [
            {
                index: true,
                element: <p className="text-text-muted text-sm">Select a note to start editing</p>
            },
            { path: ":noteId", Component: Note }
        ]
    },
    {
        path: "/",
        element: <Navigate to="/notes" replace />
    }
]);
