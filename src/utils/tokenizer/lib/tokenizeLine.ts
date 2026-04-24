import { escapeHtml } from "@utils/escapeHtml";

import { inlineTokenize } from "./inline";
import { tokenizeHeading, tokenizeHr, tokenizeList, tokenizeQuote, tokenizeTaskList } from "./line";

export function tokenizeLine(line: string): string {
    return (
        tokenizeHeading(line) ??
        tokenizeQuote(line) ??
        tokenizeTaskList(line) ??
        tokenizeList(line) ??
        tokenizeHr(line) ??
        inlineTokenize(escapeHtml(line))
    );
}
