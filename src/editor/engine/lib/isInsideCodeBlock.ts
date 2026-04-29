export function isInsideCodeBlock(content: string, position: number): boolean {
    const before = content.slice(0, position);
    const fenceCount = (before.match(/^(```|~~~)/gm) || []).length;
    return fenceCount % 2 === 1;
}
