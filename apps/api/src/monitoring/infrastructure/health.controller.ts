import { Controller, Get } from "@nestjs/common";

import { healthResponseSchema } from "@ardoise/shared";

import { CheckHealth } from "../application/checkHealth";

import type { HealthResponse } from "@ardoise/shared";

@Controller("health")
export class HealthController {
    constructor(private readonly checkHealth: CheckHealth) {}

    @Get()
    async check(): Promise<HealthResponse> {
        const status = await this.checkHealth.execute();
        return healthResponseSchema.parse(status);
    }
}
