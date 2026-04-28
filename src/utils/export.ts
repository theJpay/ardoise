import { strToU8, zipSync } from "fflate";

import { NoteEntity } from "@entities";

import type { Note } from "@entities";

export function exportNotesToZip(notes: Note[]): void {
    const files: Record<string, Uint8Array> = {};

    for (const note of notes) {
        files[buildFilename(note)] = strToU8(buildMarkdown(note));
    }

    const zipped = zipSync(files);
    const blob = new Blob([zipped as unknown as BlobPart], { type: "application/zip" });
    triggerDownload(blob, `ardoise-export-${todayIso()}.zip`);
}

function buildFilename(note: Note): string {
    return `${slugify(NoteEntity.getTitle(note))}-${note.id}.md`;
}

function buildMarkdown(note: Note): string {
    return `# ${NoteEntity.getTitle(note)}\n\n${note.content}`;
}

function slugify(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function todayIso(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
