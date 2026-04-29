import { escapeHtml } from "@utils/escapeHtml";

import { inlineTokenize } from "../inline";

export function tokenizeTaskList(line: string): string | null {
    const unchecked = line.match(/^(\s*)- \[ \] (.*)$/);
    if (unchecked) {
        return (
            escapeHtml(unchecked[1]) +
            `<span class="ed-token-muted">- [ ] </span>` +
            inlineTokenize(escapeHtml(unchecked[2]))
        );
    }
    const checked = line.match(/^(\s*)- \[([xX])\] (.*)$/);
    if (checked) {
        return (
            escapeHtml(checked[1]) +
            `<span class="ed-token-muted">- [${checked[2]}] </span>` +
            `<span class="ed-strike">${escapeHtml(checked[3])}</span>`
        );
    }
    return null;
}
