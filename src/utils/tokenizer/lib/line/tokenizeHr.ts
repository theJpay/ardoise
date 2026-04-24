import { escapeHtml } from "@utils/escapeHtml";

export function tokenizeHr(line: string): string | null {
    if (/^(---+|\*\*\*+|___+)$/.test(line)) {
        return `<span class="ed-token-muted">${escapeHtml(line)}</span>`;
    }
    return null;
}
