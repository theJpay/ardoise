import type { ListLineInfo } from "../engine";

export type SmartEnterOp = { kind: "exit-list" } | { kind: "continue-list"; nextMarker: string };

type DecideSmartEnterArgs = {
    key: string;
    shiftKey: boolean;
    metaKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    start: number;
    end: number;
    lineEnd: number;
    listInfo: ListLineInfo | null;
};

export function decideSmartEnter({
    key,
    shiftKey,
    metaKey,
    ctrlKey,
    altKey,
    start,
    end,
    lineEnd,
    listInfo
}: DecideSmartEnterArgs): SmartEnterOp | null {
    if (key !== "Enter") {
        return null;
    }
    if (shiftKey || metaKey || ctrlKey || altKey) {
        return null;
    }
    if (!listInfo) {
        return null;
    }
    if (start !== end) {
        return null;
    }
    if (start !== lineEnd) {
        return null;
    }
    if (listInfo.isEmpty) {
        return { kind: "exit-list" };
    }
    return { kind: "continue-list", nextMarker: listInfo.nextMarker };
}
