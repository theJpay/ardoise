import { TriangleAlert } from "lucide-react";
import { Component } from "react";

import { Button } from "@components/generics";

import type { ErrorInfo, ReactNode } from "react";

type ErrorBoundaryProps = {
    children: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Uncaught error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback />;
        }
        return this.props.children;
    }
}

export function ErrorFallback() {
    return (
        <div className="bg-bg flex h-screen flex-col items-center justify-center gap-5 px-6">
            <TriangleAlert className="text-subtle" size={32} strokeWidth={1.5} />
            <div className="flex flex-col items-center gap-1.5 text-center">
                <h1 className="text-ui-h2 text-muted">Something went wrong.</h1>
                <p className="text-ui-sm text-subtle">Your notes are safe. Reload to continue.</p>
            </div>
            <Button label="Reload" onClick={() => window.location.reload()} />
        </div>
    );
}

export default ErrorBoundary;
