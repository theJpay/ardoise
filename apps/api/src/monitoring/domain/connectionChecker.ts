export const CONNECTION_CHECKERS = Symbol("CONNECTION_CHECKERS");

export interface CheckResult {
    name: string;
    status: "ok" | "down";
    latencyMs?: number;
    error?: string;
}

export interface ConnectionChecker {
    check(): Promise<CheckResult>;
}
