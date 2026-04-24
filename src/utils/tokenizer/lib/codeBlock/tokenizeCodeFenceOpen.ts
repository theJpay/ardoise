import { escapeHtml } from "@utils/escapeHtml";

export function tokenizeCodeFenceOpen(line: string, fenceChar: "`" | "~"): string {
    const delim = fenceChar.repeat(3);
    const lang = line.slice(3);
    if (lang) {
        return (
            `<span class="ed-token-muted">${delim}</span>` +
            `<span class="ed-code-lang">${escapeHtml(lang)}</span>`
        );
    }
    return `<span class="ed-token-muted">${escapeHtml(line)}</span>`;
}
