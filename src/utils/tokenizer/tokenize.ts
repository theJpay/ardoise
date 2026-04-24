import { escapeHtml } from "@utils/escapeHtml";

import { formatCodeBlock, matchFenceOpen, tokenizeCodeFenceOpen } from "./lib/codeBlock";
import { tokenizeLine } from "./lib/tokenizeLine";

import type { FenceOpen } from "./lib/codeBlock";

class Tokenizer {
    private result: string[] = [];
    private fenceChar: "`" | "~" | null = null;
    private fenceLength: number = 0;
    private codeLang: string | null = null;
    private codeBuffer: string[] = [];

    static tokenize(content: string): string {
        return new Tokenizer().run(content);
    }

    private run(content: string): string {
        for (const line of content.split("\n")) {
            if (this.fenceChar === null) {
                this.handleContentLine(line);
            } else if (line.startsWith(this.fenceChar.repeat(this.fenceLength))) {
                this.closeFence(line);
            } else {
                this.codeBuffer.push(line);
            }
        }
        this.pushCodeBlock();
        return this.result.join("\n");
    }

    private handleContentLine(line: string): void {
        const opener = matchFenceOpen(line);
        if (opener !== null) {
            this.openFence(line, opener);
        } else {
            this.result.push(tokenizeLine(line));
        }
    }

    private openFence(line: string, opener: FenceOpen): void {
        this.result.push(tokenizeCodeFenceOpen(line, opener.char, opener.length));
        this.codeLang = line.slice(opener.length).trim() || null;
        this.fenceChar = opener.char;
        this.fenceLength = opener.length;
    }

    private closeFence(line: string): void {
        this.pushCodeBlock();
        this.result.push(`<span class="ed-token-muted">${escapeHtml(line)}</span>`);
        this.codeLang = null;
        this.fenceChar = null;
        this.fenceLength = 0;
    }

    private pushCodeBlock(): void {
        if (this.codeBuffer.length === 0) {
            return;
        }
        this.result.push(formatCodeBlock(this.codeBuffer, this.codeLang));
        this.codeBuffer = [];
    }
}

export const tokenize = Tokenizer.tokenize;
