import type { CheckResult } from "./connectionChecker";

export type OverallStatus = "ok" | "degraded";

export interface HealthStatus {
    status: OverallStatus;
    checks: CheckResult[];
}

export function computeOverallStatus(checks: CheckResult[]): OverallStatus {
    return checks.every((c) => c.status === "ok") ? "ok" : "degraded";
}
