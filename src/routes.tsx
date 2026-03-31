import { createBrowserRouter, Navigate } from "react-router";

import { Note, NoteIndex } from "@components";

import App from "./App.tsx";

export const router = createBrowserRouter([
    {
        path: "/notes",
        Component: App,
        children: [
            {
                index: true,
                element: <NoteIndex />
            },
            { path: ":noteId", element: <Note /> }
        ]
    },
    {
        path: "/",
        element: <Navigate to="/notes" replace />
    }
]);
