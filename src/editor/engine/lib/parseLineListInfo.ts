import type { ListLineInfo } from "../EditorEngine";

export function parseLineListInfo(line: string): ListLineInfo | null {
    const task = line.match(/^(\s*)- \[([ xX])\] (.*)$/);
    if (task) {
        const [, indent, state, content] = task;
        return {
            marker: `${indent}- [${state}] `,
            nextMarker: `${indent}- [ ] `,
            isEmpty: content === ""
        };
    }
    const unordered = line.match(/^(\s*)([-*]) (.*)$/);
    if (unordered) {
        const [, indent, markerChar, content] = unordered;
        const marker = `${indent}${markerChar} `;
        return { marker, nextMarker: marker, isEmpty: content === "" };
    }
    const ordered = line.match(/^(\s*)(\d+)\. (.*)$/);
    if (ordered) {
        const [, indent, num, content] = ordered;
        return {
            marker: `${indent}${num}. `,
            nextMarker: `${indent}${parseInt(num) + 1}. `,
            isEmpty: content === ""
        };
    }
    return null;
}
