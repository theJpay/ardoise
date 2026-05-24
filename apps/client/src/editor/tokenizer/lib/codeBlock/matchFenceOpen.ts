export type FenceOpen = {
    char: "`" | "~";
    length: number;
};

export function matchFenceOpen(line: string): FenceOpen | null {
    const match = line.match(/^(`{3,}|~{3,})/);
    if (!match) {
        return null;
    }
    const fence = match[0];
    return { char: fence[0] as "`" | "~", length: fence.length };
}
