import { getLineStart } from "./line";

export function hasLinePrefix(content: string, position: number, prefix: string): boolean {
    const lineStart = getLineStart(content, position);
    return content.slice(lineStart, lineStart + prefix.length) === prefix;
}
