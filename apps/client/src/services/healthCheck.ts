import { healthResponseSchema } from "@ardoise/shared";

const API_URL = import.meta.env.VITE_API_URL;

export async function pingHealth(): Promise<void> {
    if (!API_URL) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = healthResponseSchema.parse(await response.json());
        console.log("[api] health", data);
    } catch (error) {
        console.error("[api] health check failed", error);
    }
}
