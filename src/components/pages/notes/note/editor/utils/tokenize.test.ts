import { describe, expect, it } from "vitest";

import { tokenize } from "./tokenize";

describe("tokenize — headings", () => {
    it("wraps the hashes in ed-token-dim", () => {
        const input = "# Title";

        const result = tokenize(input);

        expect(result).toContain('<span class="ed-token-dim"># </span>');
    });

    it.each([1, 2, 3, 4])("uses ed-heading for level %i", (level) => {
        const input = `${"#".repeat(level)} T`;

        const result = tokenize(input);

        expect(result).toContain('class="ed-heading"');
    });

    it("uses ed-h5 for level 5", () => {
        const input = "##### T";

        const result = tokenize(input);

        expect(result).toContain('class="ed-h5"');
    });

    it("uses ed-h6 for level 6", () => {
        const input = "###### T";

        const result = tokenize(input);

        expect(result).toContain('class="ed-h6"');
    });

    it("does not treat a hash without a trailing space as a heading", () => {
        const input = "#notaheading";

        const result = tokenize(input);

        expect(result).not.toContain("ed-heading");
    });

    it("does not treat more than 6 hashes as a heading", () => {
        const input = "####### seven";

        const result = tokenize(input);

        expect(result).not.toContain("ed-heading");
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

    it("accepts uppercase X for checked tasks", () => {
        const input = "- [X] done";

        const result = tokenize(input);

        expect(result).toContain('class="ed-strike"');
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

        expect(result).toContain('class="ed-bold"');
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

        expect(result).toContain('class="ed-italic"');
    });

    it("wraps bold-italic with ***", () => {
        const input = "***both***";

        const result = tokenize(input);

        expect(result).toContain('class="ed-bold ed-italic"');
    });

    it("does not treat bold ** as italic *", () => {
        const input = "**bold**";

        const result = tokenize(input);

        expect(result).not.toContain('class="ed-italic"');
    });

    it("wraps strikethrough with ~~", () => {
        const input = "~~gone~~";

        const result = tokenize(input);

        expect(result).toContain('class="ed-strike"');
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

    it("does not apply inline transforms inside a code span", () => {
        const input = "`**not bold**`";

        const result = tokenize(input);

        expect(result).not.toContain('class="ed-bold"');
    });

    it("wraps a code span in ed-code", () => {
        const input = "`code`";

        const result = tokenize(input);

        expect(result).toContain('class="ed-code"');
    });

    it("escapes raw HTML-like characters in plain text", () => {
        const input = "a < b & c > d";

        const result = tokenize(input);

        expect(result).toBe("a &lt; b &amp; c &gt; d");
    });
});

describe("tokenize — fenced code blocks", () => {
    it("renders an opening fence with no language as muted backticks", () => {
        const input = "```\nhi\n```";

        const result = tokenize(input).split("\n");

        expect(result[0]).toBe('<span class="ed-token-muted">```</span>');
    });

    it("renders the buffered content between fences", () => {
        const input = "```\nhi\n```";

        const result = tokenize(input).split("\n");

        expect(result[1]).toBe("hi");
    });

    it("renders a closing fence as muted backticks", () => {
        const input = "```\nhi\n```";

        const result = tokenize(input).split("\n");

        expect(result[2]).toBe('<span class="ed-token-muted">```</span>');
    });

    it("escapes HTML in unhighlighted code blocks", () => {
        const input = "```\n<script>&\n```";

        const result = tokenize(input);

        expect(result).toContain("&lt;script&gt;&amp;");
    });

    it("renders an opening fence with a registered language using ed-code-lang", () => {
        const input = "```js\nconst a = 1;\n```";

        const result = tokenize(input).split("\n")[0];

        expect(result).toContain('class="ed-code-lang">js');
    });

    it("produces syntax-highlighted HTML for registered languages", () => {
        const input = "```js\nconst a = 1;\n```";

        const result = tokenize(input);

        expect(result).toContain("hljs-");
    });

    it("falls back to plain escape for unregistered languages", () => {
        const input = "```madeuplang\n<x>\n```";

        const result = tokenize(input);

        expect(result).toContain("&lt;x&gt;");
    });

    it("does not syntax-highlight unregistered languages", () => {
        const input = "```madeuplang\n<x>\n```";

        const result = tokenize(input);

        expect(result).not.toContain("hljs-");
    });

    it("flushes an unclosed code block at end of content", () => {
        const input = "```\nhello";

        const result = tokenize(input);

        expect(result).toContain("hello");
    });

    it("treats inline syntax as literal inside code blocks", () => {
        const input = "```\n**not bold**\n```";

        const result = tokenize(input);

        expect(result).not.toContain('class="ed-bold"');
    });
});
