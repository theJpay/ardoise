import { createBrowserRouter, Navigate } from "react-router";
import App from "./App.tsx";
import { NoteEditor } from "./components/editor";

export const router = createBrowserRouter([
    {
        path: "/notes",
        Component: App,
        children: [
            {
                index: true,
                element: <p className="text-text-muted text-sm">Select a note to start editing</p>
            },
            { path: ":noteId", Component: NoteEditor }
        ]
    },
    {
        path: "/",
        element: <Navigate to="/notes" replace />
    }
]);
