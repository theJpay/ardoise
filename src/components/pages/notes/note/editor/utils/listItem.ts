type ListType = "task" | "unordered" | "ordered";

type ListInfo = {
    type: ListType;
    indent: string;
    marker: string;
    content: string;
};

export function parseListLine(line: string): ListInfo | null {
    const task = line.match(/^(\s*)- \[([ xX])\] (.*)$/);
    if (task) {
        return { type: "task", indent: task[1], marker: `- [${task[2]}]`, content: task[3] };
    }
    const unordered = line.match(/^(\s*)([-*]) (.*)$/);
    if (unordered) {
        return {
            type: "unordered",
            indent: unordered[1],
            marker: unordered[2],
            content: unordered[3]
        };
    }
    const ordered = line.match(/^(\s*)(\d+)\. (.*)$/);
    if (ordered) {
        return {
            type: "ordered",
            indent: ordered[1],
            marker: `${ordered[2]}.`,
            content: ordered[3]
        };
    }
    return null;
}

export function isListLine(line: string): boolean {
    return parseListLine(line) !== null;
}

export function getListContinuation(line: string): string | "break" | null {
    const info = parseListLine(line);
    if (!info) {
        return null;
    }
    if (info.content === "") {
        return "break";
    }
    switch (info.type) {
        case "task":
            return `${info.indent}- [ ] `;
        case "unordered":
            return `${info.indent}${info.marker} `;
        case "ordered": {
            const next = parseInt(info.marker) + 1;
            return `${info.indent}${next}. `;
        }
    }
}
