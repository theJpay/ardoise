import { Module } from "@nestjs/common";

import { CheckHealth } from "./application/checkHealth";
import { CONNECTION_CHECKERS } from "./domain/connectionChecker";
import { HealthController } from "./infrastructure/health.controller";
import { SupabaseConnectionChecker } from "./infrastructure/supabaseConnectionChecker";

@Module({
    controllers: [HealthController],
    providers: [
        CheckHealth,
        SupabaseConnectionChecker,
        {
            provide: CONNECTION_CHECKERS,
            useFactory: (supabase: SupabaseConnectionChecker) => [supabase],
            inject: [SupabaseConnectionChecker]
        }
    ]
})
export class MonitoringModule {}
