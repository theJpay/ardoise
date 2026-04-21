import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import { ErrorBoundary } from "@components";

import "./index.css";

import { queryClient } from "./queryClient.ts";
import { router } from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>
);
