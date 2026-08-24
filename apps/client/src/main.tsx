import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import { ErrorBoundary } from "@components";
import { pingHealth } from "@services/healthCheck";

import { router } from "./routes";
import "./index.css";

pingHealth();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
    </StrictMode>
);
