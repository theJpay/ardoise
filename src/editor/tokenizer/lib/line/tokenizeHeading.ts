import { escapeHtml } from "@utils/escapeHtml";

import { inlineTokenize } from "../inline";

export function tokenizeHeading(line: string): string | null {
    const match = line.match(/^(#{1,6}) (.*)$/);
    if (!match) {
        return null;
    }
    const hashes = match[1];
    const content = match[2];
    const level = hashes.length;
    const contentClass = level <= 4 ? "ed-heading" : level === 5 ? "ed-h5" : "ed-h6";
    return (
        `<span class="ed-token-dim">${escapeHtml(hashes)} </span>` +
        `<span class="${contentClass}">${inlineTokenize(escapeHtml(content))}</span>`
    );
}
