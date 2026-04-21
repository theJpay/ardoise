import { common, createLowlight } from "lowlight";

export const lowlight = createLowlight(common);

export function isRegistered(name: string): boolean {
    return lowlight.registered(name);
}

export function highlight(language: string, code: string) {
    return lowlight.highlight(language, code);
}
