type EnclosingFence = {
    openingStart: number;
    closingEnd: number;
    innerContent: string;
};

export function findEnclosingFence(content: string, position: number): EnclosingFence | null {
    const lines = content.split("\n");
    let currentLineIndex = 0;
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= position) {
            currentLineIndex = i;
            break;
        }
        charCount += lines[i].length + 1;
    }

    let openingLine = -1;
    let fenceChar = "";
    for (let i = currentLineIndex; i >= 0; i--) {
        if (lines[i].startsWith("```")) {
            openingLine = i;
            fenceChar = "```";
            break;
        }
        if (lines[i].startsWith("~~~")) {
            openingLine = i;
            fenceChar = "~~~";
            break;
        }
    }

    if (openingLine === -1) {
        return null;
    }

    let closingLine = -1;
    for (let i = currentLineIndex; i < lines.length; i++) {
        if (lines[i].startsWith(fenceChar) && i !== openingLine) {
            closingLine = i;
            break;
        }
    }

    if (closingLine === -1) {
        return null;
    }

    let openingStart = 0;
    for (let i = 0; i < openingLine; i++) {
        openingStart += lines[i].length + 1;
    }

    let closingEnd = 0;
    for (let i = 0; i <= closingLine; i++) {
        closingEnd += lines[i].length + 1;
    }
    closingEnd -= 1;

    const innerContent = lines.slice(openingLine + 1, closingLine).join("\n");
    return { openingStart, closingEnd, innerContent };
}
