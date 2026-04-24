import { escapeHtml } from "@utils/escapeHtml";

import { formatCodeBlock, matchFenceOpen, tokenizeCodeFenceOpen } from "./lib/codeBlock";
import { tokenizeLine } from "./lib/tokenizeLine";

export function tokenize(content: string): string {
    const lines = content.split("\n");
    const result: string[] = [];
    let fenceChar: "`" | "~" | null = null;
    let codeLang: string | null = null;
    let codeBuffer: string[] = [];

    const flushCodeBlock = () => {
        if (codeBuffer.length === 0) {
            return;
        }
        result.push(formatCodeBlock(codeBuffer, codeLang));
        codeBuffer = [];
    };

    for (const line of lines) {
        if (fenceChar === null) {
            const opener = matchFenceOpen(line);
            if (opener !== null) {
                result.push(tokenizeCodeFenceOpen(line, opener));
                codeLang = line.slice(3).trim() || null;
                fenceChar = opener;
            } else {
                result.push(tokenizeLine(line));
            }
        } else if (line.startsWith(fenceChar.repeat(3))) {
            flushCodeBlock();
            result.push(`<span class="ed-token-muted">${escapeHtml(line)}</span>`);
            codeLang = null;
            fenceChar = null;
        } else {
            codeBuffer.push(line);
        }
    }
    flushCodeBlock();

    return result.join("\n");
}
