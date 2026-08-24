import { Injectable } from "@nestjs/common";

import type { CheckResult, ConnectionChecker } from "../domain/connectionChecker";

const TIMEOUT_MS = 2000;

@Injectable()
export class SupabaseConnectionChecker implements ConnectionChecker {
    private readonly url: string;

    constructor() {
        this.url = process.env.SUPABASE_URL ?? "http://localhost:54321";
    }

    async check(): Promise<CheckResult> {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const start = Date.now();
        try {
            const response = await fetch(`${this.url}/auth/v1/health`, {
                signal: controller.signal
            });
            const latencyMs = Date.now() - start;
            if (!response.ok) {
                return {
                    name: "supabase",
                    status: "down",
                    latencyMs,
                    error: `HTTP ${response.status}`
                };
            }
            return { name: "supabase", status: "ok", latencyMs };
        } catch (error) {
            return {
                name: "supabase",
                status: "down",
                error: error instanceof Error ? error.message : String(error)
            };
        } finally {
            clearTimeout(timer);
        }
    }
}
