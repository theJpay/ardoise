import { Controller, Get } from "@nestjs/common";

import { healthResponseSchema } from "@ardoise/shared";

import type { HealthResponse } from "@ardoise/shared";

@Controller("health")
export class HealthController {
    @Get()
    check(): HealthResponse {
        return healthResponseSchema.parse({ status: "ok" });
    }
}
