import { highlightToHtml, isRegistered } from "@utils/lowlight";

import { escapeHtml } from "./escapeHtml";

export function tokenize(content: string): string {
    const lines = content.split("\n");
    const result: string[] = [];
    let fenceChar: "`" | "~" | null = null;
    let codeLang: string | null = null;
    let codeBuffer: string[] = [];

    const flushCodeBlock = () => {
        if (codeBuffer.length === 0) {
            return;
        }
        result.push(formatCodeBlock(codeBuffer, codeLang));
        codeBuffer = [];
    };

    for (const line of lines) {
        if (fenceChar === null) {
            const opener = matchFenceOpen(line);
            if (opener !== null) {
                result.push(tokenizeCodeFenceOpen(line, opener));
                codeLang = line.slice(3).trim() || null;
                fenceChar = opener;
            } else {
                result.push(tokenizeLine(line));
            }
        } else if (line.startsWith(fenceChar.repeat(3))) {
            flushCodeBlock();
            result.push(`<span class="ed-token-muted">${escapeHtml(line)}</span>`);
            codeLang = null;
            fenceChar = null;
        } else {
            codeBuffer.push(line);
        }
    }
    flushCodeBlock();

    return result.join("\n");
}

function matchFenceOpen(line: string): "`" | "~" | null {
    if (line.startsWith("```")) {
        return "`";
    }
    if (line.startsWith("~~~")) {
        return "~";
    }
    return null;
}

function formatCodeBlock(lines: string[], lang: string | null): string {
    const code = lines.join("\n");
    if (lang && isRegistered(lang)) {
        return highlightToHtml(lang, code);
    }
    return escapeHtml(code);
}

function tokenizeLine(line: string): string {
    return (
        tokenizeHeading(line) ??
        tokenizeQuote(line) ??
        tokenizeTaskList(line) ??
        tokenizeList(line) ??
        tokenizeHr(line) ??
        inlineTokenize(escapeHtml(line))
    );
}

function tokenizeCodeFenceOpen(line: string, fenceChar: "`" | "~"): string {
    const delim = fenceChar.repeat(3);
    const lang = line.slice(3);
    if (lang) {
        return (
            `<span class="ed-token-muted">${delim}</span>` +
            `<span class="ed-code-lang">${escapeHtml(lang)}</span>`
        );
    }
    return `<span class="ed-token-muted">${escapeHtml(line)}</span>`;
}

function tokenizeHeading(line: string): string | null {
    const match = line.match(/^(#{1,6}) (.*)$/);
    if (!match) {
        return null;
    }
    const hashes = match[1];
    const content = match[2];
    const level = hashes.length;
    const contentClass = level <= 4 ? "ed-heading" : level === 5 ? "ed-h5" : "ed-h6";
    return (
        `<span class="ed-token-dim">${escapeHtml(hashes)} </span>` +
        `<span class="${contentClass}">${inlineTokenize(escapeHtml(content))}</span>`
    );
}

function tokenizeQuote(line: string): string | null {
    if (!line.startsWith("> ")) {
        return null;
    }
    return (
        `<span class="ed-token-dim">&gt; </span>` +
        `<span class="ed-quote">${inlineTokenize(escapeHtml(line.slice(2)))}</span>`
    );
}

function tokenizeTaskList(line: string): string | null {
    const unchecked = line.match(/^(\s*)- \[ \] (.*)$/);
    if (unchecked) {
        return (
            escapeHtml(unchecked[1]) +
            `<span class="ed-token-muted">- [ ] </span>` +
            inlineTokenize(escapeHtml(unchecked[2]))
        );
    }
    const checked = line.match(/^(\s*)- \[([xX])\] (.*)$/);
    if (checked) {
        return (
            escapeHtml(checked[1]) +
            `<span class="ed-token-muted">- [${checked[2]}] </span>` +
            `<span class="ed-strike">${escapeHtml(checked[3])}</span>`
        );
    }
    return null;
}

function tokenizeList(line: string): string | null {
    const unordered = line.match(/^(\s*)([-*]) (.*)$/);
    if (unordered) {
        return (
            escapeHtml(unordered[1]) +
            `<span class="ed-token-muted">${escapeHtml(unordered[2])} </span>` +
            inlineTokenize(escapeHtml(unordered[3]))
        );
    }
    const ordered = line.match(/^(\s*)(\d+\.) (.*)$/);
    if (ordered) {
        return (
            escapeHtml(ordered[1]) +
            `<span class="ed-token-muted">${escapeHtml(ordered[2])} </span>` +
            inlineTokenize(escapeHtml(ordered[3]))
        );
    }
    return null;
}

function tokenizeHr(line: string): string | null {
    if (/^(---+|\*\*\*+|___+)$/.test(line)) {
        return `<span class="ed-token-muted">${escapeHtml(line)}</span>`;
    }
    return null;
}

function inlineTokenize(html: string): string {
    return new InlineTokenizer(html)
        .applyBoldItalic()
        .applyBold()
        .applyItalic()
        .applyStrikethrough()
        .applyLink()
        .toString();
}

type Segment = { html: string; isCode: boolean };

class InlineTokenizer {
    private segments: Segment[];

    constructor(html: string) {
        const parts = html.split(/(`[^`]+`)/g);
        this.segments = parts.map((part, i) => ({
            html: part,
            isCode: i % 2 === 1
        }));
    }

    applyBoldItalic(): this {
        return this.applyToText((html) =>
            html
                .replace(
                    /(?<!\*)\*\*\*(?!\*)(?=\S)(.+?)(?<=\S)(?<!\*)\*\*\*(?!\*)/g,
                    '<span class="ed-token-muted">***</span><span class="ed-bold ed-italic">$1</span><span class="ed-token-muted">***</span>'
                )
                .replace(
                    /(?<!_)___(?!_)(?=\S)(.+?)(?<=\S)(?<!_)___(?!_)/g,
                    '<span class="ed-token-muted">___</span><span class="ed-bold ed-italic">$1</span><span class="ed-token-muted">___</span>'
                )
        );
    }

    applyBold(): this {
        return this.applyToText((html) =>
            html
                .replace(
                    /(?<!\*)\*\*(?!\*)(?=\S)(.+?)(?<=\S)(?<!\*)\*\*(?!\*)/g,
                    '<span class="ed-token-muted">**</span><span class="ed-bold">$1</span><span class="ed-token-muted">**</span>'
                )
                .replace(
                    /(?<!_)__(?!_)(?=\S)(.+?)(?<=\S)(?<!_)__(?!_)/g,
                    '<span class="ed-token-muted">__</span><span class="ed-bold">$1</span><span class="ed-token-muted">__</span>'
                )
        );
    }

    applyItalic(): this {
        return this.applyToText((html) =>
            html
                .replace(
                    /(?<!\*)\*(?!\*)(?=\S)(.+?)(?<=\S)(?<!\*)\*(?!\*)/g,
                    '<span class="ed-token-muted">*</span><span class="ed-italic">$1</span><span class="ed-token-muted">*</span>'
                )
                .replace(
                    /(?<!_)_(?!_)(?=\S)(.+?)(?<=\S)(?<!_)_(?!_)/g,
                    '<span class="ed-token-muted">_</span><span class="ed-italic">$1</span><span class="ed-token-muted">_</span>'
                )
        );
    }

    applyStrikethrough(): this {
        return this.applyToText((html) =>
            html.replace(
                /(?<!~)~~(?!~)(?=\S)(.+?)(?<=\S)(?<!~)~~(?!~)/g,
                '<span class="ed-token-muted">~~</span><span class="ed-strike">$1</span><span class="ed-token-muted">~~</span>'
            )
        );
    }

    applyLink(): this {
        return this.applyToText((html) =>
            html.replace(
                /\[(.+?)\]\((.+?)\)/g,
                '<span class="ed-token-muted">[</span><span class="ed-link">$1</span><span class="ed-token-muted">](</span><span class="ed-token-dim">$2</span><span class="ed-token-muted">)</span>'
            )
        );
    }

    toString(): string {
        return this.segments
            .map((seg) => (seg.isCode ? `<span class="ed-code">${seg.html}</span>` : seg.html))
            .join("");
    }

    private applyToText(fn: (html: string) => string): this {
        this.segments = this.segments.map((seg) =>
            seg.isCode ? seg : { ...seg, html: fn(seg.html) }
        );
        return this;
    }
}
