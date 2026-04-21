import { toHtml } from "hast-util-to-html";
import { common, createLowlight } from "lowlight";

import type { Root } from "hast";

const lowlight = createLowlight(common);

export function isRegistered(name: string): boolean {
    return lowlight.registered(name);
}

export function highlightToHast(language: string, code: string): Root {
    return lowlight.highlight(language, code);
}

export function highlightToHtml(language: string, code: string): string {
    return toHtml(lowlight.highlight(language, code));
}
