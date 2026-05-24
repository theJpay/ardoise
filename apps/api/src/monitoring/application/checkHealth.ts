import { Inject, Injectable } from "@nestjs/common";

import { CONNECTION_CHECKERS } from "../domain/connectionChecker";
import { computeOverallStatus } from "../domain/healthStatus";

import type { ConnectionChecker } from "../domain/connectionChecker";
import type { HealthStatus } from "../domain/healthStatus";

@Injectable()
export class CheckHealth {
    constructor(
        @Inject(CONNECTION_CHECKERS)
        private readonly checkers: ConnectionChecker[]
    ) {}

    async execute(): Promise<HealthStatus> {
        const checks = await Promise.all(this.checkers.map((c) => c.check()));
        return {
            status: computeOverallStatus(checks),
            checks
        };
    }
}
