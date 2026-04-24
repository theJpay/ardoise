export function matchFenceOpen(line: string): "`" | "~" | null {
    if (line.startsWith("```")) {
        return "`";
    }
    if (line.startsWith("~~~")) {
        return "~";
    }
    return null;
}
