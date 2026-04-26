import { escapeHtml } from "@utils/escapeHtml";

import { inlineTokenize } from "../inline";

export function tokenizeList(line: string): string | null {
    const unordered = line.match(/^(\s*)([-*]) (.*)$/);
    if (unordered) {
        return (
            escapeHtml(unordered[1]) +
            `<span class="ed-token-muted">${escapeHtml(unordered[2])} </span>` +
            inlineTokenize(escapeHtml(unordered[3]))
        );
    }
    const ordered = line.match(/^(\s*)(\d+\.) (.*)$/);
    if (ordered) {
        return (
            escapeHtml(ordered[1]) +
            `<span class="ed-token-muted">${escapeHtml(ordered[2])} </span>` +
            inlineTokenize(escapeHtml(ordered[3]))
        );
    }
    return null;
}
