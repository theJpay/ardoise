export function tokenize(content: string): string {
    const lines = content.split("\n");
    const result: string[] = [];
    let inCodeBlock = false;

    for (const line of lines) {
        if (/^```/.test(line)) {
            if (!inCodeBlock) {
                result.push(tokenizeCodeFenceOpen(line));
                inCodeBlock = true;
            } else {
                result.push(`<span class="ed-token-muted">${escapeHtml(line)}</span>`);
                inCodeBlock = false;
            }
        } else if (inCodeBlock) {
            result.push(escapeHtml(line));
        } else {
            result.push(tokenizeLine(line));
        }
    }

    return result.join("\n");
}

function tokenizeLine(line: string): string {
    return (
        tokenizeHeading(line) ??
        tokenizeQuote(line) ??
        tokenizeList(line) ??
        tokenizeHr(line) ??
        inlineTokenize(escapeHtml(line))
    );
}

function tokenizeCodeFenceOpen(line: string): string {
    const lang = line.slice(3);
    if (lang) {
        return (
            `<span class="ed-token-muted">\`\`\`</span>` +
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
        `<span class="${contentClass}">${escapeHtml(content)}</span>`
    );
}

function tokenizeQuote(line: string): string | null {
    if (!line.startsWith("> ")) {
        return null;
    }
    return (
        `<span class="ed-token-muted">&gt; </span>` +
        `<span class="ed-quote">${escapeHtml(line.slice(2))}</span>`
    );
}

function tokenizeList(line: string): string | null {
    const unordered = line.match(/^([-*]) (.*)$/);
    if (unordered) {
        return (
            `<span class="ed-token-muted">${escapeHtml(unordered[1])} </span>` +
            inlineTokenize(escapeHtml(unordered[2]))
        );
    }
    const ordered = line.match(/^(\d+\.) (.*)$/);
    if (ordered) {
        return (
            `<span class="ed-token-muted">${escapeHtml(ordered[1])} </span>` +
            inlineTokenize(escapeHtml(ordered[2]))
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
                    /\*\*\*(.+?)\*\*\*/g,
                    '<span class="ed-token-muted">***</span><span class="ed-bold ed-italic">$1</span><span class="ed-token-muted">***</span>'
                )
                .replace(
                    /___(.+?)___/g,
                    '<span class="ed-token-muted">___</span><span class="ed-bold ed-italic">$1</span><span class="ed-token-muted">___</span>'
                )
        );
    }

    applyBold(): this {
        return this.applyToText((html) =>
            html
                .replace(
                    /\*\*(.+?)\*\*/g,
                    '<span class="ed-token-muted">**</span><span class="ed-bold">$1</span><span class="ed-token-muted">**</span>'
                )
                .replace(
                    /__(.+?)__/g,
                    '<span class="ed-token-muted">__</span><span class="ed-bold">$1</span><span class="ed-token-muted">__</span>'
                )
        );
    }

    applyItalic(): this {
        return this.applyToText((html) =>
            html
                .replace(
                    /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
                    '<span class="ed-token-muted">*</span><span class="ed-italic">$1</span><span class="ed-token-muted">*</span>'
                )
                .replace(
                    /(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g,
                    '<span class="ed-token-muted">_</span><span class="ed-italic">$1</span><span class="ed-token-muted">_</span>'
                )
        );
    }

    applyStrikethrough(): this {
        return this.applyToText((html) =>
            html.replace(
                /~~(.+?)~~/g,
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

function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
