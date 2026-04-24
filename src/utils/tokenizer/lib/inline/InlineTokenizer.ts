type Segment = { html: string; isCode: boolean };

export class InlineTokenizer {
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
