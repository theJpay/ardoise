import { createBrowserRouter, Navigate } from "react-router";

import { ErrorFallback } from "@components";
import { NoteIndex, NotesPage } from "@components/pages/notes";
import {
    DangerZoneSection,
    ExportSection,
    GeneralSection,
    PrivacySection,
    SettingsPage
} from "@components/pages/settings";

import App from "./App.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        errorElement: <ErrorFallback />,
        children: [
            {
                index: true,
                element: <Navigate to="/notes" replace />
            },
            {
                path: "notes",
                element: <NotesPage />,
                children: [
                    { index: true, element: <NoteIndex /> },
                    {
                        path: ":noteId",
                        lazy: async () => ({
                            Component: (await import("@components/pages/notes/note/Note")).default
                        })
                    }
                ]
            },
            {
                path: "settings",
                element: <SettingsPage />,
                children: [
                    { index: true, element: <Navigate to="/settings/general" replace /> },
                    { path: "general", element: <GeneralSection /> },
                    { path: "privacy", element: <PrivacySection /> },
                    { path: "export", element: <ExportSection /> },
                    { path: "danger", element: <DangerZoneSection /> }
                ]
            }
        ]
    }
]);
