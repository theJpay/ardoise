import { escapeHtml } from "@utils/escapeHtml";
import { highlightToHtml, isRegistered } from "@utils/lowlight";

export function formatCodeBlock(lines: string[], lang: string | null): string {
    const code = lines.join("\n");
    if (lang && isRegistered(lang)) {
        return highlightToHtml(lang, code);
    }
    return escapeHtml(code);
}
