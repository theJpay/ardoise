import { toHtml } from "hast-util-to-html";
import { common, createLowlight } from "lowlight";

export const lowlight = createLowlight(common);

export function isRegistered(name: string): boolean {
    return lowlight.registered(name);
}

export function highlightToHtml(language: string, code: string): string {
    return toHtml(lowlight.highlight(language, code));
}
