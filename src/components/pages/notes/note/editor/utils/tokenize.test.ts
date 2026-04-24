import { describe, expect, it } from "vitest";

import { tokenize } from "./tokenize";

describe("tokenize — headings", () => {
    it.each([
        [1, "ed-heading"],
        [2, "ed-heading"],
        [3, "ed-heading"],
        [4, "ed-heading"],
        [5, "ed-h5"],
        [6, "ed-h6"]
    ])("renders level %i heading with %s class", (level, className) => {
        const hashes = "#".repeat(level);
        const input = `${hashes} T`;

        const result = tokenize(input);

        expect(result).toBe(
            `<span class="ed-token-dim">${hashes} </span><span class="${className}">T</span>`
        );
    });

    it("does not treat a hash without a trailing space as a heading", () => {
        const input = "#notaheading";

        const result = tokenize(input);

        expect(result).toBe("#notaheading");
    });

    it("does not treat more than 6 hashes as a heading", () => {
        const input = "####### seven";

        const result = tokenize(input);

        expect(result).toBe("####### seven");
    });
});

describe("tokenize — block syntax", () => {
    it("renders block quotes", () => {
        const input = "> quoted";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-dim">&gt; </span><span class="ed-quote">quoted</span>'
        );
    });

    it("renders unchecked task items", () => {
        const input = "- [ ] todo";

        const result = tokenize(input);

        expect(result).toBe('<span class="ed-token-muted">- [ ] </span>todo');
    });

    it("renders checked task items with strikethrough", () => {
        const input = "- [x] done";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">- [x] </span><span class="ed-strike">done</span>'
        );
    });

    it("renders a checked task with uppercase X preserving the marker case", () => {
        const input = "- [X] done";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">- [X] </span><span class="ed-strike">done</span>'
        );
    });

    it("preserves indentation in task items", () => {
        const input = "    - [ ] nested";

        const result = tokenize(input);

        expect(result).toBe('    <span class="ed-token-muted">- [ ] </span>nested');
    });

    it.each([
        ["- item", '<span class="ed-token-muted">- </span>item'],
        ["* item", '<span class="ed-token-muted">* </span>item'],
        ["1. item", '<span class="ed-token-muted">1. </span>item']
    ])("renders list marker for %s", (input, expected) => {
        const result = tokenize(input);

        expect(result).toBe(expected);
    });

    it.each(["---", "***", "___"])("renders horizontal rule for %s", (input) => {
        const result = tokenize(input);

        expect(result).toBe(`<span class="ed-token-muted">${input}</span>`);
    });
});

describe("tokenize — inline syntax", () => {
    it("wraps bold with **", () => {
        const input = "**bold**";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">**</span>' +
                '<span class="ed-bold">bold</span>' +
                '<span class="ed-token-muted">**</span>'
        );
    });

    it("wraps bold with __", () => {
        const input = "__bold__";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">__</span>' +
                '<span class="ed-bold">bold</span>' +
                '<span class="ed-token-muted">__</span>'
        );
    });

    it("wraps italic with *", () => {
        const input = "*italic*";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">*</span>' +
                '<span class="ed-italic">italic</span>' +
                '<span class="ed-token-muted">*</span>'
        );
    });

    it("wraps italic with _", () => {
        const input = "_italic_";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">_</span>' +
                '<span class="ed-italic">italic</span>' +
                '<span class="ed-token-muted">_</span>'
        );
    });

    it("wraps bold-italic with *** as a flat span", () => {
        const input = "***both***";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">***</span>' +
                '<span class="ed-bold ed-italic">both</span>' +
                '<span class="ed-token-muted">***</span>'
        );
    });

    it("leaves ****x**** literal when the delimiter run is too long", () => {
        const input = "****both****";

        const result = tokenize(input);

        expect(result).toBe("****both****");
    });

    it("wraps strikethrough with ~~", () => {
        const input = "~~gone~~";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">~~</span>' +
                '<span class="ed-strike">gone</span>' +
                '<span class="ed-token-muted">~~</span>'
        );
    });

    it("wraps markdown links", () => {
        const input = "[text](https://example.com)";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">[</span>' +
                '<span class="ed-link">text</span>' +
                '<span class="ed-token-muted">](</span>' +
                '<span class="ed-token-dim">https://example.com</span>' +
                '<span class="ed-token-muted">)</span>'
        );
    });

    it("wraps a code span in ed-code", () => {
        const input = "`code`";

        const result = tokenize(input);

        expect(result).toBe('<span class="ed-code">`code`</span>');
    });

    it("does not apply inline transforms inside a code span", () => {
        const input = "`**not bold**`";

        const result = tokenize(input);

        expect(result).toBe('<span class="ed-code">`**not bold**`</span>');
    });

    it("escapes raw HTML-like characters in plain text", () => {
        const input = "a < b & c > d";

        const result = tokenize(input);

        expect(result).toBe("a &lt; b &amp; c &gt; d");
    });
});

describe("tokenize — fenced code blocks", () => {
    it("renders a fenced block with no language", () => {
        const input = "```\nhi\n```";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">```</span>\n' +
                "hi\n" +
                '<span class="ed-token-muted">```</span>'
        );
    });

    it("escapes HTML in unhighlighted code blocks", () => {
        const input = "```\n<script>&\n```";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">```</span>\n' +
                "&lt;script&gt;&amp;\n" +
                '<span class="ed-token-muted">```</span>'
        );
    });

    it("renders an opening fence with a registered language using ed-code-lang", () => {
        const input = "```js\nconst a = 1;\n```";

        const firstLine = tokenize(input).split("\n")[0];

        expect(firstLine).toBe(
            '<span class="ed-token-muted">```</span><span class="ed-code-lang">js</span>'
        );
    });

    it("produces syntax-highlighted HTML for registered languages", () => {
        const input = "```js\nconst a = 1;\n```";

        const result = tokenize(input);

        expect(result).toContain("hljs-");
    });

    it("falls back to plain escape for unregistered languages", () => {
        const input = "```madeuplang\n<x>\n```";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">```</span><span class="ed-code-lang">madeuplang</span>\n' +
                "&lt;x&gt;\n" +
                '<span class="ed-token-muted">```</span>'
        );
    });

    it("flushes an unclosed code block at end of content", () => {
        const input = "```\nhello";

        const result = tokenize(input);

        expect(result).toBe('<span class="ed-token-muted">```</span>\nhello');
    });

    it("treats inline syntax as literal inside code blocks", () => {
        const input = "```\n**not bold**\n```";

        const result = tokenize(input);

        expect(result).toBe(
            '<span class="ed-token-muted">```</span>\n' +
                "**not bold**\n" +
                '<span class="ed-token-muted">```</span>'
        );
    });
});

describe("tokenize — golden sample", () => {
    it("renders a dense markdown sample as expected HTML", async () => {
        const input = [
            "# Main",
            "## Sub with **bold** and *italic*",
            "> quoted **bold** *italic* `code` ~~strike~~",
            "- [x] done",
            "- [ ] todo",
            "- item with `code` and [link](https://example.com)",
            "1. first",
            "---",
            "```js",
            "const x = 1;",
            "```",
            "plain paragraph with ***both***"
        ].join("\n");

        const result = tokenize(input);

        await expect(result).toMatchFileSnapshot("./__snapshots__/tokenize-golden.html");
    });
});
