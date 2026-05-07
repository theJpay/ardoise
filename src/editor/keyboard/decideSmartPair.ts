import { PAIRS } from "./pairs";

const CLOSERS = new Set(Object.values(PAIRS));
const WORD_CHAR = /[\p{L}\p{N}_]/u;

export type SmartPairOp =
    | { kind: "wrap"; opener: string; closer: string }
    | { kind: "insert"; opener: string; closer: string }
    | { kind: "skip"; char: string };

type DecideSmartPairArgs = {
    key: string;
    value: string;
    start: number;
    end: number;
};

export function decideSmartPair({
    key,
    value,
    start,
    end
}: DecideSmartPairArgs): SmartPairOp | null {
    const isOpener = key in PAIRS;
    const isCloser = CLOSERS.has(key);
    if (!isOpener && !isCloser) {
        return null;
    }

    if (start === end && isCloser && value[start] === key) {
        return { kind: "skip", char: key };
    }

    if (!isOpener) {
        return null;
    }

    const closer = PAIRS[key];
    if (start !== end) {
        return { kind: "wrap", opener: key, closer };
    }
    const next = value[start];
    if (next !== undefined && WORD_CHAR.test(next)) {
        return null;
    }
    return { kind: "insert", opener: key, closer };
}
