import { escapeHtml } from "@utils/escapeHtml";

export function tokenizeCodeFenceOpen(
    line: string,
    fenceChar: "`" | "~",
    fenceLength: number
): string {
    const delim = fenceChar.repeat(fenceLength);
    const lang = line.slice(fenceLength);
    if (lang) {
        return (
            `<span class="ed-token-muted">${delim}</span>` +
            `<span class="ed-code-lang">${escapeHtml(lang)}</span>`
        );
    }
    return `<span class="ed-token-muted">${escapeHtml(line)}</span>`;
}
