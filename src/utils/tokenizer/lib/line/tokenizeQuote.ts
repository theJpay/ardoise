import { escapeHtml } from "@utils/escapeHtml";

import { inlineTokenize } from "../inline";

export function tokenizeQuote(line: string): string | null {
    if (!line.startsWith("> ")) {
        return null;
    }
    return (
        `<span class="ed-token-dim">&gt; </span>` +
        `<span class="ed-quote">${inlineTokenize(escapeHtml(line.slice(2)))}</span>`
    );
}
