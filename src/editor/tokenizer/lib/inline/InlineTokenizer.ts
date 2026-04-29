const CODE_MARKER_OPEN = "";
const CODE_MARKER_CLOSE = "";
const CODE_PLACEHOLDER = new RegExp(`${CODE_MARKER_OPEN}(\\d+)${CODE_MARKER_CLOSE}`, "g");

const URL_MARKER_OPEN = "";
const URL_MARKER_CLOSE = "";
const LINK_PATTERN = new RegExp(
    `\\[(.+?)\\]\\(${URL_MARKER_OPEN}(\\d+)${URL_MARKER_CLOSE}\\)`,
    "g"
);

export class InlineTokenizer {
    private html: string;
    private codeSpans: string[] = [];
    private linkUrls: string[] = [];

    constructor(html: string) {
        this.html = html.replace(/`[^`]+`/g, (match) => {
            const index = this.codeSpans.length;
            this.codeSpans.push(match);
            return `${CODE_MARKER_OPEN}${index}${CODE_MARKER_CLOSE}`;
        });
        this.html = this.html.replace(/(\[.+?\]\()(.+?)(\))/g, (_, open, url, close) => {
            const index = this.linkUrls.length;
            this.linkUrls.push(url);
            return `${open}${URL_MARKER_OPEN}${index}${URL_MARKER_CLOSE}${close}`;
        });
    }

    applyBoldItalic(): this {
        this.html = this.html
            .replace(
                /(?<!\*)\*\*\*(?!\*)(?=\S)(.+?)(?<=\S)(?<!\*)\*\*\*(?!\*)/g,
                '<span class="ed-token-muted">***</span><span class="ed-bold ed-italic">$1</span><span class="ed-token-muted">***</span>'
            )
            .replace(
                /(?<!_)___(?!_)(?=\S)(.+?)(?<=\S)(?<!_)___(?!_)/g,
                '<span class="ed-token-muted">___</span><span class="ed-bold ed-italic">$1</span><span class="ed-token-muted">___</span>'
            );
        return this;
    }

    applyBold(): this {
        this.html = this.html
            .replace(
                /(?<!\*)\*\*(?!\*)(?=\S)(.+?)(?<=\S)(?<!\*)\*\*(?!\*)/g,
                '<span class="ed-token-muted">**</span><span class="ed-bold">$1</span><span class="ed-token-muted">**</span>'
            )
            .replace(
                /(?<!_)__(?!_)(?=\S)(.+?)(?<=\S)(?<!_)__(?!_)/g,
                '<span class="ed-token-muted">__</span><span class="ed-bold">$1</span><span class="ed-token-muted">__</span>'
            );
        return this;
    }

    applyItalic(): this {
        this.html = this.html
            .replace(
                /(?<!\*)\*(?!\*)(?=\S)(.+?)(?<=\S)(?<!\*)\*(?!\*)/g,
                '<span class="ed-token-muted">*</span><span class="ed-italic">$1</span><span class="ed-token-muted">*</span>'
            )
            .replace(
                /(?<!_)_(?!_)(?=\S)(.+?)(?<=\S)(?<!_)_(?!_)/g,
                '<span class="ed-token-muted">_</span><span class="ed-italic">$1</span><span class="ed-token-muted">_</span>'
            );
        return this;
    }

    applyStrikethrough(): this {
        this.html = this.html.replace(
            /(?<!~)~~(?!~)(?=\S)(.+?)(?<=\S)(?<!~)~~(?!~)/g,
            '<span class="ed-token-muted">~~</span><span class="ed-strike">$1</span><span class="ed-token-muted">~~</span>'
        );
        return this;
    }

    applyLink(): this {
        this.html = this.html.replace(LINK_PATTERN, (_, label, urlIndex) => {
            const url = this.linkUrls[Number(urlIndex)];
            return (
                '<span class="ed-token-muted">[</span>' +
                `<span class="ed-link">${label}</span>` +
                '<span class="ed-token-muted">](</span>' +
                `<span class="ed-token-dim">${url}</span>` +
                '<span class="ed-token-muted">)</span>'
            );
        });
        return this;
    }

    toString(): string {
        return this.html.replace(CODE_PLACEHOLDER, (_, index) => {
            return `<span class="ed-code">${this.codeSpans[Number(index)]}</span>`;
        });
    }
}
