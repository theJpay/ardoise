import { z } from "zod";

export const checkResultSchema = z.object({
    name: z.string(),
    status: z.enum(["ok", "down"]),
    latencyMs: z.number().int().nonnegative().optional(),
    error: z.string().optional()
});

export const healthResponseSchema = z.object({
    status: z.enum(["ok", "degraded"]),
    checks: z.array(checkResultSchema)
});

export type CheckResult = z.infer<typeof checkResultSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
